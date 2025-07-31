import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Database, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface DataVerificationTestProps {
  applicationId: string;
  candidateName: string;
}

export const DataVerificationTest: React.FC<DataVerificationTestProps> = ({
  applicationId,
  candidateName
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const verifyData = async () => {
    setIsChecking(true);
    setVerificationResult(null);
    
    try {
      console.log("🔍 Data Verification - Checking application data...");
      console.log("Application ID:", applicationId);
      
      const { data: appData, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .single();
      
      console.log("🔍 Data Verification - Raw data from database:", appData);
      
      if (error) {
        console.error("🔍 Data Verification - Error:", error);
        setVerificationResult({ success: false, error: error.message });
        toast.error(`Verification failed: ${error.message}`);
        return;
      }
      
      // Analyser les données
      const analysis = {
        hasScore: appData.score > 0,
        hasFeedback: !!appData.feedback,
        hasSkills: Array.isArray(appData.skills) && appData.skills.length > 0,
        hasExperience: !!appData.experience && appData.experience.trim() !== '',
        hasEducation: !!appData.education && appData.education.trim() !== '',
        hasUpdatedAt: !!appData.updated_at,
        feedbackParsed: null as any
      };
      
      // Essayer de parser le feedback
      if (appData.feedback) {
        try {
          analysis.feedbackParsed = JSON.parse(appData.feedback);
        } catch (e) {
          console.log("🔍 Data Verification - Feedback is not JSON");
        }
      }
      
      console.log("🔍 Data Verification - Analysis:", analysis);
      
      const allFieldsPresent = analysis.hasScore && analysis.hasFeedback && 
                              analysis.hasSkills && analysis.hasExperience && 
                              analysis.hasEducation && analysis.hasUpdatedAt;
      
      setVerificationResult({
        success: allFieldsPresent,
        data: appData,
        analysis: analysis
      });
      
      if (allFieldsPresent) {
        toast.success("✅ All data fields are present and updated!");
      } else {
        toast.warning("⚠️ Some data fields are missing or not updated");
      }
      
    } catch (error) {
      console.error("🔍 Data Verification - Exception:", error);
      setVerificationResult({ success: false, error: error.message });
      toast.error(`Verification exception: ${error.message}`);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Card className="mb-4 border-green-200 bg-green-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-green-800">🔍 Vérification des Données</CardTitle>
          <Button
            onClick={verifyData}
            disabled={isChecking}
            variant="outline"
            size="sm"
            className="bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
          >
            {isChecking ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Vérification...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Vérifier les données
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
                            <strong>Candidate:</strong> {candidateName}
          </div>
          
          {verificationResult && (
            <div className="mt-4 p-3 bg-white rounded border">
              <div className="flex items-center gap-2 mb-3">
                {verificationResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <strong>
                  {verificationResult.success ? 'Toutes les données sont présentes' : 'Données incomplètes'}
                </strong>
              </div>
              
              {verificationResult.analysis && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`p-2 rounded ${verificationResult.analysis.hasScore ? 'bg-green-100' : 'bg-red-100'}`}>
                      <strong>Score:</strong> {verificationResult.analysis.hasScore ? '✅' : '❌'}
                    </div>
                    <div className={`p-2 rounded ${verificationResult.analysis.hasFeedback ? 'bg-green-100' : 'bg-red-100'}`}>
                      <strong>Feedback:</strong> {verificationResult.analysis.hasFeedback ? '✅' : '❌'}
                    </div>
                    <div className={`p-2 rounded ${verificationResult.analysis.hasSkills ? 'bg-green-100' : 'bg-red-100'}`}>
                      <strong>Skills:</strong> {verificationResult.analysis.hasSkills ? '✅' : '❌'}
                    </div>
                    <div className={`p-2 rounded ${verificationResult.analysis.hasExperience ? 'bg-green-100' : 'bg-red-100'}`}>
                      <strong>Experience:</strong> {verificationResult.analysis.hasExperience ? '✅' : '❌'}
                    </div>
                    <div className={`p-2 rounded ${verificationResult.analysis.hasEducation ? 'bg-green-100' : 'bg-red-100'}`}>
                      <strong>Education:</strong> {verificationResult.analysis.hasEducation ? '✅' : '❌'}
                    </div>
                    <div className={`p-2 rounded ${verificationResult.analysis.hasUpdatedAt ? 'bg-green-100' : 'bg-red-100'}`}>
                      <strong>Updated At:</strong> {verificationResult.analysis.hasUpdatedAt ? '✅' : '❌'}
                    </div>
                  </div>
                  
                  {verificationResult.data && (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-xs text-gray-600">
                        Voir les données brutes
                      </summary>
                      <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                        {JSON.stringify(verificationResult.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              )}
              
              {verificationResult.error && (
                <div className="text-red-600 mt-2">
                  <strong>Erreur:</strong> {verificationResult.error}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 