import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, Database, Eye, EyeOff } from "lucide-react";

interface DebugDataDisplayProps {
  jobId: string;
}

export const DebugDataDisplay: React.FC<DebugDataDisplayProps> = ({ jobId }) => {
  const [rawData, setRawData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const fetchRawData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('job_id', jobId);

      if (error) {
        console.error('Error fetching raw data:', error);
        return;
      }

      console.log('Raw data from database:', data);
      setRawData(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchRawData();
    }
  }, [isVisible, jobId]);

  if (!isVisible) {
    return (
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">🔧 Mode Débogage</CardTitle>
            <Button
              onClick={() => setIsVisible(true)}
              variant="outline"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              Afficher les données brutes
            </Button>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mb-4 border-orange-200 bg-orange-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-orange-800">🔧 Données Brutes de la Base</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              onClick={fetchRawData}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Button
              onClick={() => setIsVisible(false)}
              variant="outline"
              size="sm"
            >
              <EyeOff className="h-4 w-4 mr-2" />
              Masquer
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rawData.map((app, index) => (
            <div key={app.id} className="border rounded-lg p-3 bg-white">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{app.name}</h4>
                <Badge variant={app.score > 0 ? "default" : "secondary"}>
                  Score: {app.score || 0}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>ID:</strong> {app.id}
                </div>
                <div>
                  <strong>Score:</strong> {app.score || 'Non défini'}
                </div>
                <div>
                  <strong>Feedback:</strong>
                  <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                    {app.feedback || 'Aucun feedback'}
                  </pre>
                </div>
                <div>
                  <strong>Updated At:</strong> {app.updated_at || 'Non défini'}
                </div>
              </div>
            </div>
          ))}
          {rawData.length === 0 && !isLoading && (
            <div className="text-center text-gray-500 py-4">
              Aucune donnée trouvée
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 