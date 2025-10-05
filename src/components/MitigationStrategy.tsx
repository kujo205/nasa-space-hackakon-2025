import { useState } from "react";
import { evaluateMitigationStrategyApi } from "../lib/evaluateMitigationStrategyApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, Sparkles, RotateCcw } from "lucide-react";

interface MitigationStrategyProps {
  neoObjectData: object;
}

const MITIGATION_STRATEGIES = [
  "Kinetic impactor",
  "Gravity tractor",
  "Laser ablation",
  "Ion beam shepherd",
  "Nuclear blast",
] as const;

type MitigationStrategyType = (typeof MITIGATION_STRATEGIES)[number];

export default function MitigationStrategy(props: MitigationStrategyProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<
    MitigationStrategyType | ""
  >("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<{
    success: boolean;
    data?: {
      delflectionEffectiveness: string;
      costEffectiveness: string;
      conclusion: string;
    };
    error?: string;
  } | null>(null);

  const handleEvaluate = async () => {
    if (!selectedStrategy) return;

    setIsLoading(true);
    setResponse(null);

    try {
      const result = await evaluateMitigationStrategyApi(
        selectedStrategy,
        props.neoObjectData,
      );
      setResponse(result);
    } catch (error) {
      setResponse({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReevaluate = () => {
    setResponse(null);
    setSelectedStrategy("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mitigation Strategy Evaluation</CardTitle>
          <CardDescription>
            Select a deflection strategy to evaluate its effectiveness for this
            NEO
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="strategy-select" className="text-sm font-medium">
              Mitigation Strategy
            </label>
            <Select
              value={selectedStrategy}
              onValueChange={(value) =>
                setSelectedStrategy(value as MitigationStrategyType)
              }
              disabled={isLoading}
            >
              <SelectTrigger id="strategy-select">
                <SelectValue placeholder="Select a mitigation strategy" />
              </SelectTrigger>
              <SelectContent>
                {MITIGATION_STRATEGIES.map((strategy) => (
                  <SelectItem key={strategy} value={strategy}>
                    {strategy}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleEvaluate}
              disabled={!selectedStrategy || isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Evaluating...
                </>
              ) : (
                "Evaluate Mitigation Strategy"
              )}
            </Button>

            {response && (
              <Button
                onClick={handleReevaluate}
                variant="outline"
                disabled={isLoading}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reevaluate
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Analyzing mitigation strategy...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {response && !isLoading && (
        <>
          {response.success && response.data ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 " />
                  Evaluation Results
                </CardTitle>
                <CardDescription>
                  Strategy:{" "}
                  <span className="font-semibold">{selectedStrategy}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">
                    Deflection Effectiveness
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {response.data.delflectionEffectiveness}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Cost Effectiveness</h3>
                  <p className="text-sm text-muted-foreground">
                    {response.data.costEffectiveness}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Conclusion</h3>
                  <p className="text-sm text-muted-foreground">
                    {response.data.conclusion}
                  </p>
                </div>

                <p className="text-xs text-muted-foreground italic">
                  This is an LLM-based prediction and may be inaccurate.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {response.error || "Failed to evaluate mitigation strategy"}
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
}
