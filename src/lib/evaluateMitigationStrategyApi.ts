import {
  type MitigationResponse,
  type MitigationRequest,
} from "../app/api/evaluate_mitigation_prediction/route";

/**
 * Evaluates a mitigation strategy for an asteroid threat
 * @param method - The mitigation method (e.g., "Kinetic impactor")
 * @param asteroidData - Complete asteroid data from NASA API
 * @returns Promise with evaluation results
 */
async function evaluateMitigationStrategyApi(
  method: string,
  asteroidData: object,
): Promise<MitigationResponse> {
  const API_URL = "/api/evaluate_mitigation_prediction";

  const requestBody: MitigationRequest = {
    method,
    asteroidData,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: MitigationResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error evaluating mitigation strategy:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Export for use in other modules
export {
  evaluateMitigationStrategyApi,
  type MitigationRequest,
  type MitigationResponse,
};
