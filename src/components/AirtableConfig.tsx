
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAirtableConfig } from '@/hooks/useAirtable';
import { Settings, Database, Key } from 'lucide-react';

const AirtableConfig = () => {
  const { config, updateConfig, clearConfig } = useAirtableConfig();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    apiKey: config?.apiKey || '',
    baseId: config?.baseId || 'appjSFSHxwJqhnUJj',
    tableName: config?.tableName || 'Client DB'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.apiKey) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir votre clé API Airtable",
        variant: "destructive"
      });
      return;
    }

    updateConfig(formData);
    toast({
      title: "Configuration sauvegardée",
      description: "Votre configuration Airtable a été mise à jour"
    });
  };

  const handleClear = () => {
    clearConfig();
    setFormData({
      apiKey: '',
      baseId: 'appjSFSHxwJqhnUJj',
      tableName: 'Client DB'
    });
    toast({
      title: "Configuration effacée",
      description: "La configuration Airtable a été supprimée"
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Database className="w-6 h-6 text-thai-orange" />
          <Settings className="w-6 h-6 text-thai-green" />
        </div>
        <CardTitle className="text-thai-green">Configuration Airtable</CardTitle>
        <CardDescription>
          Configurez l'accès à votre base de données Airtable
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="flex items-center space-x-2">
              <Key className="w-4 h-4" />
              <span>Clé API Airtable *</span>
            </Label>
            <Input
              id="apiKey"
              type="password"
              value={formData.apiKey}
              onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
              placeholder="pat..."
              className="border-thai-orange/30 focus:border-thai-orange"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="baseId">ID de base</Label>
            <Input
              id="baseId"
              value={formData.baseId}
              onChange={(e) => setFormData(prev => ({ ...prev, baseId: e.target.value }))}
              className="border-thai-orange/30 focus:border-thai-orange"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tableName">Nom de table par défaut</Label>
            <Input
              id="tableName"
              value={formData.tableName}
              onChange={(e) => setFormData(prev => ({ ...prev, tableName: e.target.value }))}
              className="border-thai-orange/30 focus:border-thai-orange"
            />
          </div>

          <div className="flex space-x-2">
            <Button 
              type="submit" 
              className="flex-1 bg-thai-orange hover:bg-thai-orange-dark"
            >
              Sauvegarder
            </Button>
            {config && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClear}
                className="border-thai-green text-thai-green hover:bg-thai-green hover:text-white"
              >
                Effacer
              </Button>
            )}
          </div>
        </form>
        
        {config && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              ✅ Configuration active
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AirtableConfig;
