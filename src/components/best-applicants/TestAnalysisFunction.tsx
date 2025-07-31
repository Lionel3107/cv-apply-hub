import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, TestTube, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface TestAnalysisFunctionProps {
  applicationId: string;
  candidateName: string;
  candidateEmail: string;
}

export const TestAnalysisFunction: React.FC<TestAnalysisFunctionProps> = ({
  applicationId,
  candidateName,
  candidateEmail
}) => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const testAnalysis = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      console.log("🧪 Test Analysis - Starting...");
      console.log("Application ID:", applicationId);
      
      const testData = {
        applicationId: applicationId,
        jobDescription: "Test job description for analysis"
      };
      
      console.log("🧪 Test Analysis - Sending data:", testData);
      
      const { data: result, error } = await supabase.functions.invoke('analyze-cv', {
        body: testData
      });
      
      console.log("🧪 Test Analysis - Raw response:", { result, error });
      
      if (error) {
        console.error("🧪 Test Analysis - Error:", error);
        setTestResult({ success: false, error: error.message });
        toast.error(`Test failed: ${error.message}`);
        return;
      }
      
      console.log("🧪 Test Analysis - Success result:", result);
      setTestResult(result);
      
      if (result?.success) {
        toast.success(`Test successful! Score: ${result.analysis?.score}/100`);
        
        // Vérifier si les données sont bien mises à jour dans la base
        setTimeout(async () => {
          console.log("🧪 Test Analysis - Verifying database update...");
          const { data: verifyData, error: verifyError } = await supabase
            .from('applications')
            .select('score, feedback, updated_at')
            .eq('id', applicationId)
            .single();
            
          console.log("🧪 Test Analysis - Database verification:", { verifyData, verifyError });
          
          if (verifyError) {
            console.error("🧪 Test Analysis - Verification error:", verifyError);
          } else {
            console.log("🧪 Test Analysis - Verified data:", verifyData);
            if (verifyData.score > 0) {
              toast.success("✅ Database update verified!");
            } else {
              toast.error("❌ Database update failed - score still 0");
            }
          }
        }, 2000);
      } else {
        toast.error(`Test failed: ${result?.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("🧪 Test Analysis - Exception:", error);
      setTestResult({ success: false, error: error.message });
      toast.error(`Test exception: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-blue-800">🧪 Test Edge Function</CardTitle>
          <Button
            onClick={testAnalysis}
            disabled={isTesting}
            variant="outline"
            size="sm"
            className="bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
          >
            {isTesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Test en cours...
              </>
            ) : (
              <>
                <TestTube className="mr-2 h-4 w-4" />
                Tester l'analyse
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Application ID:</strong> {applicationId}
          </div>
          <div>
                            <strong>Candidate:</strong> {candidateName} ({candidateEmail})
          </div>
          
          {testResult && (
            <div className="mt-4 p-3 bg-white rounded border">
              <div className="flex items-center gap-2 mb-2">
                {testResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <strong>
                  {testResult.success ? 'Test Réussi' : 'Test Échoué'}
                </strong>
              </div>
              
              {testResult.success && testResult.analysis && (
                <div className="space-y-1">
                  <div><strong>Score:</strong> {testResult.analysis.score}/100</div>
                  <div><strong>Strengths:</strong> {testResult.analysis.strengths?.length || 0}</div>
                  <div><strong>Improvements:</strong> {testResult.analysis.improvements?.length || 0}</div>
                  <div><strong>Recommendation:</strong> {testResult.analysis.recommendation}</div>
                </div>
              )}
              
              {testResult.error && (
                <div className="text-red-600">
                  <strong>Erreur:</strong> {testResult.error}
                </div>
              )}
              
              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-gray-600">
                  Voir les détails complets
                </summary>
                <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 