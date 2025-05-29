
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAirtableConfig } from '@/hooks/useAirtable';
import { AlertCircle, CheckCircle2, Database, Settings, ExternalLink } from 'lucide-react';

const AirtableConfig = () => {
  const { config, updateConfig, clearConfig } = useAirtableConfig();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    apiKey: config?.apiKey || 'patv1NAa7UcbOsZci.691853f527b865aeb7c799efc1d98d58e30b0b1c2429ef8a4deac404b086658c',
    baseId: config?.baseId || 'appjSFSHxwJqhnUJj',
    tableName: config?.tableName || 'Plats DB'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Test de connexion simple
      const response = await fetch(`https://api.airtable.com/v0/${formData.baseId}/${formData.tableName}?maxRecords=1`, {
        headers: {
          'Authorization': `Bearer ${formData.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Airtable API Error:', errorData);
        
        if (response.status === 403) {
          throw new Error(`Erreur de permissions (403): Vérifiez que votre token a les permissions 'data.records:read' et 'data.records:write' pour la base ${formData.baseId} et la table '${formData.tableName}'`);
        } else if (response.status === 404) {
          throw new Error(`Table ou base non trouvée (404): Vérifiez que la base ${formData.baseId} et la table '${formData.tableName}' existent`);
        }
        throw new Error(`Erreur de connexion: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Airtable connection test successful:', data);

      updateConfig(formData);
      toast({
        title: "Configuration sauvegardée !",
        description: "La connexion à Airtable a été établie avec succès.",
      });
    } catch (error) {
      console.error('Airtable config error:', error);
      toast({
        title: "Erreur de configuration",
        description: error instanceof Error ? error.message : "Impossible de se connecter à Airtable",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    clearConfig();
    setFormData({
      apiKey: '',
      baseId: 'appjSFSHxwJqhnUJj',
      tableName: 'Plats DB'
    });
    toast({
      title: "Configuration effacée",
      description: "Les paramètres Airtable ont été supprimés.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-thai py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="shadow-xl border-thai-orange/20">
          <CardHeader className="text-center bg-gradient-to-r from-thai-orange to-thai-gold text-white rounded-t-lg">
            <div className="flex items-center justify-center mb-2">
              <Database className="h-8 w-8 mr-2" />
              <CardTitle className="text-2xl font-bold">Configuration Airtable</CardTitle>
            </div>
            <CardDescription className="text-white/90">
              Connectez votre base de données Airtable pour gérer vos menus et commandes
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            {config && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Connexion active :</strong> Base {config.baseId} - Table {config.tableName}
                </AlertDescription>
              </Alert>
            )}

            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Important :</strong> Votre token doit avoir les permissions suivantes :
                <ul className="list-disc ml-4 mt-2">
                  <li><code>data.records:read</code> - pour lire les données</li>
                  <li><code>data.records:write</code> - pour créer des commandes</li>
                </ul>
                Et l'accès à la base <code>appjSFSHxwJqhnUJj</code>
              </AlertDescription>
            </Alert>

            <Alert className="mb-6 border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Obtenir votre clé API :</strong> Rendez-vous sur{' '}
                <a 
                  href="https://airtable.com/create/tokens" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline inline-flex items-center"
                >
                  airtable.com/create/tokens <ExternalLink className="h-3 w-3 ml-1" />
                </a>
                {' '}et créez un token avec les permissions de lecture/écriture pour votre base.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="text-thai-green font-medium">
                  Clé API Airtable (Personal Access Token) *
                </Label>
                <Input
                  id="apiKey"
                  type="text"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
                  placeholder="patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                  required
                  className="border-thai-orange/30 focus:border-thai-orange font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="baseId" className="text-thai-green font-medium">
                  ID de Base Airtable *
                </Label>
                <Input
                  id="baseId"
                  value={formData.baseId}
                  onChange={(e) => setFormData({...formData, baseId: e.target.value})}
                  placeholder="appXXXXXXXXXXXXXX"
                  required
                  className="border-thai-orange/30 focus:border-thai-orange font-mono"
                />
                <p className="text-sm text-thai-green/70">
                  Base Chanthanathai Cook : appjSFSHxwJqhnUJj
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tableName" className="text-thai-green font-medium">
                  Table par Défaut
                </Label>
                <Input
                  id="tableName"
                  value={formData.tableName}
                  onChange={(e) => setFormData({...formData, tableName: e.target.value})}
                  placeholder="Plats DB"
                  className="border-thai-orange/30 focus:border-thai-orange"
                />
                <p className="text-sm text-thai-green/70">
                  Tables disponibles : Plats DB, Client DB, Commandes, Demandes Traiteur
                </p>
              </div>

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  disabled={isLoading || !formData.apiKey || !formData.baseId}
                  className="flex-1 bg-thai-orange hover:bg-thai-orange-dark text-white py-6 text-lg rounded-xl"
                >
                  {isLoading ? 'Test de connexion...' : 'Sauvegarder & Tester'}
                </Button>
                
                {config && (
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleClear}
                    className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white py-6 px-6 rounded-xl"
                  >
                    Effacer
                  </Button>
                )}
              </div>
            </form>

            <div className="mt-8 p-4 bg-thai-cream/30 rounded-lg">
              <h4 className="font-semibold text-thai-green mb-2">🔧 Structure des Tables Attendues</h4>
              <ul className="text-sm text-thai-green/80 space-y-1">
                <li>• <strong>Plats DB</strong> : Nom, Description, Prix, Categorie, Disponible</li>
                <li>• <strong>Client DB</strong> : Nom, Prenom, Email, Telephone</li>
                <li>• <strong>Commandes</strong> : Client Email, Total, Date Retrait, Statut</li>
                <li>• <strong>Demandes Traiteur</strong> : Nom Evenement, Type, Date, Contact</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AirtableConfig;
