import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, AlertCircle, Settings } from "lucide-react";

export const EnvironmentCheck: React.FC = () => {
  const [checks, setChecks] = useState<any>({});
  const [isChecking, setIsChecking] = useState(false);

  const runChecks = async () => {
    setIsChecking(true);
    const results: any = {};

    try {
      // Check 1: Supabase connection
      console.log("🔍 Environment Check - Testing Supabase connection...");
      const { data: testData, error: testError } = await supabase
        .from('applications')
        .select('count')
        .limit(1);
      
      results.supabaseConnection = {
        success: !testError,
        error: testError?.message,
        details: testError ? 'Impossible de se connecter à Supabase' : 'Connexion réussie'
      };

      // Check 2: Edge Function availability
      console.log("🔍 Environment Check - Testing Edge Function availability...");
      try {
        const { data: funcData, error: funcError } = await supabase.functions.invoke('analyze-cv', {
          body: {
            applicationId: 'test-id-for-check',
            jobDescription: 'Test job for environment check',
            candidateData: {
              name: 'Test Candidate',
              email: 'test@example.com',
              experience: 'Test experience',
              education: 'Test education',
              skills: ['Test Skill 1', 'Test Skill 2']
            }
          }
        });
        
        console.log("🔍 Environment Check - Edge Function response:", { funcData, funcError });
        
        // L'Edge Function peut retourner une erreur pour un ID de test, mais elle doit être accessible
        results.edgeFunction = {
          success: !funcError || (funcError && funcError.message && !funcError.message.includes('function not found')),
          error: funcError?.message,
          details: funcError ? 
            (funcError.message.includes('function not found') ? 'Edge Function non déployée' : 'Edge Function accessible mais erreur attendue pour test') : 
            'Edge Function accessible'
        };
      } catch (e) {
        console.error("🔍 Environment Check - Edge Function exception:", e);
        results.edgeFunction = {
          success: false,
          error: e.message,
          details: 'Exception lors de l\'appel de l\'Edge Function'
        };
      }

      // Check 3: Database permissions
      console.log("🔍 Environment Check - Testing database permissions...");
      
      // Test 1: Lecture
      const { data: readData, error: readError } = await supabase
        .from('applications')
        .select('id, score, feedback')
        .limit(1);
      
      console.log("🔍 Environment Check - Read test:", { readData, readError });
      
      // Test 2: Écriture (avec un vrai UUID qui n'existe probablement pas)
      const testUUID = '00000000-0000-0000-0000-000000000000';
      const { data: writeData, error: writeError } = await supabase
        .from('applications')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', testUUID)
        .select();
      
      console.log("🔍 Environment Check - Write test:", { writeData, writeError });
      
      // Test 3: Vérifier la structure de la table
      const { data: structureData, error: structureError } = await supabase
        .from('applications')
        .select('id, score, feedback, updated_at')
        .limit(0);
      
      console.log("🔍 Environment Check - Structure test:", { structureData, structureError });
      
      // Évaluer les permissions
      const hasReadPermission = !readError;
      const hasWritePermission = !writeError || writeError.code === 'PGRST116'; // PGRST116 = no rows affected
      const hasCorrectStructure = !structureError;
      
      results.databasePermissions = {
        success: hasReadPermission && hasWritePermission && hasCorrectStructure,
        error: writeError?.message || readError?.message || structureError?.message,
        details: `Lecture: ${hasReadPermission ? 'OK' : 'ÉCHEC'}, Écriture: ${hasWritePermission ? 'OK' : 'ÉCHEC'}, Structure: ${hasCorrectStructure ? 'OK' : 'ÉCHEC'}`
      };

      // Check 4: Environment variables (client-side check)
      console.log("🔍 Environment Check - Checking environment variables...");
      const envVars = {
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
        supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      };
      
      results.environmentVariables = {
        success: !!(envVars.supabaseUrl && envVars.supabaseAnonKey),
        error: !envVars.supabaseUrl || !envVars.supabaseAnonKey ? 'Variables manquantes' : null,
        details: envVars.supabaseUrl && envVars.supabaseAnonKey ? 'Variables configurées' : 'Variables d\'environnement manquantes'
      };

    } catch (error) {
      console.error("🔍 Environment Check - General error:", error);
      results.general = {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        details: 'Erreur générale lors des vérifications'
      };
    }

    console.log("🔍 Environment Check - Results:", results);
    setChecks(results);
    setIsChecking(false);
  };

  useEffect(() => {
    runChecks();
  }, []);

  const getStatusIcon = (success: boolean) => {
    if (success) return <CheckCircle className="h-4 w-4 text-green-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  const getStatusBadge = (success: boolean) => {
    if (success) return <Badge className="bg-green-100 text-green-800">OK</Badge>;
    return <Badge variant="destructive">Erreur</Badge>;
  };

  return (
    <Card className="mb-4 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-yellow-800">🔍 Vérification de l'Environnement</CardTitle>
          <Button
            onClick={runChecks}
            disabled={isChecking}
            variant="outline"
            size="sm"
            className="bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200"
          >
            <Settings className="mr-2 h-4 w-4" />
            {isChecking ? 'Vérification...' : 'Vérifier'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(checks).map(([key, check]: [string, any]) => (
            <div key={key} className="flex items-center justify-between p-2 bg-white rounded border">
              <div className="flex items-center gap-2">
                {getStatusIcon(check.success)}
                <div>
                  <div className="font-medium text-sm">
                    {key === 'supabaseConnection' && 'Connexion Supabase'}
                    {key === 'edgeFunction' && 'Edge Function'}
                    {key === 'databasePermissions' && 'Permissions Base de Données'}
                    {key === 'environmentVariables' && 'Variables d\'Environnement'}
                    {key === 'general' && 'Général'}
                  </div>
                  <div className="text-xs text-gray-600">{check.details}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(check.success)}
                {check.error && (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
            </div>
          ))}
          
          {Object.keys(checks).length === 0 && (
            <div className="text-center text-gray-500 py-4">
              Aucune vérification effectuée
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 