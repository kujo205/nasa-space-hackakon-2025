import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const requestSchema = z.object({
  method: z.string(),
  asteroidData: z.object({}).passthrough(),
});

// API Route Handler
export async function POST(req: NextRequest) {
  console.log("received request");
  try {
    // Parse request bod
    const body = await req.json();

    console.log("received request", body);

    // Validate input
    const validation = requestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.message,
        },
        { status: 400 },
      );
    }

    const { method, asteroidData } = validation.data;

    console.log("checking api key ");

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 },
      );
    }

    console.log("evaludating the data");

    // Evaluate mitigation prediction
    const result = await evaluateMitigationPrediction(
      method,
      JSON.stringify(asteroidData),
    );

    // Return successful response
    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error evaluating mitigation prediction:", error);

    // Handle specific error types
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Schema validation failed",
          details: error.message,
        },
        { status: 422 },
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

const zodReportSchema = z.object({
  delflectionEffectiveness: z
    .string()
    .describe("is user preferred deflection method effection"),
  costEffectiveness: z
    .string()
    .describe("is user preferred deflection method cost effective"),
  conclusion: z
    .string()
    .describe(
      "[state if it’s suitable or not; if not, list better alternatives from: Kinetic impactor, Gravity tractor, Laser ablation, Ion beam shepherd, Nuclear blast]. Give a brief explanation why listed alternatives are better in this particular task",
    ),
});

async function evaluateMitigationPrediction(
  method: string,
  asteroidData: string,
) {
  const openaiApi = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const result = await generateObject({
    model: openaiApi("gpt-5-mini"),
    output: "object",
    schema: zodReportSchema,
    maxRetries: 3,
    temperature: 0.2,
    prompt: getPrompt(method, asteroidData),
  });

  return result.object;
}

function getPrompt(method: string, asteroidData: string) {
  return `

You are an expert in asteroid dynamics and planetary defense technologies, with extensive knowledge of asteroid deflection methods. Based on the provided asteroid data, evaluate whether the selected deflection method is the best option.

Your answer must be concise but have all necessary explanations to fully understand the content (500 characters total) and structured exactly like this:

Deflection Effectiveness: [brief 1–2 sentence summary]
Cost Effectiveness: [brief 1–2 sentence summary]

Conclusion:  [state if it’s suitable or not; if not, list better alternatives from: Kinetic impactor, Gravity tractor, Laser ablation, Ion beam shepherd, Nuclear blast]. Give a brief explanation why listed alternatives are better in this particular task

Selected Deflection Method: ${method}
Asteroid Data: ${asteroidData}
`;
}
