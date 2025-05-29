
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Users, Database, AlertCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import { usePlats, useAirtableConfig, useCreateDemandeTraiteur } from '@/hooks/useAirtable';

const Evenements = () => {
  const { toast } = useToast();
  const { config } = useAirtableConfig();
  const { plats } = usePlats();
  const createDemandeTraiteur = useCreateDemandeTraiteur();
  
  const [dateEvenement, setDateEvenement] = useState<Date>();
  const [platsSelectionnes, setPlatsSelectionnes] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    nomEvenement: '',
    typeEvenement: '',
    nombrePersonnes: '',
    budgetClient: '',
    demandesSpeciales: '',
    contactEmail: '',
    contactTelephone: ''
  });

  const typesEvenements = [
    'Anniversaire',
    'Mariage',
    'Événement d\'entreprise',
    'Réunion de famille',
    'Fête entre amis',
    'Inauguration',
    'Autre'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePlatSelection = (platId: string) => {
    setPlatsSelectionnes(prev => 
      prev.includes(platId)
        ? prev.filter(id => id !== platId)
        : [...prev, platId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dateEvenement || !formData.contactEmail) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    try {
      const platsSelectionnesDetails = plats.filter(plat => 
        platsSelectionnes.includes(plat.id)
      );

      await createDemandeTraiteur.mutateAsync({
        ...formData,
        dateEvenement: dateEvenement.toISOString(),
        platsSelectionnes: platsSelectionnesDetails
      });
      
      toast({
        title: "Demande envoyée avec succès !",
        description: "Nous vous contacterons sous 24h pour discuter de votre événement.",
      });
      
      // Réinitialiser le formulaire
      setFormData({
        nomEvenement: '',
        typeEvenement: '',
        nombrePersonnes: '',
        budgetClient: '',
        demandesSpeciales: '',
        contactEmail: '',
        contactTelephone: ''
      });
      setDateEvenement(undefined);
      setPlatsSelectionnes([]);
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre demande.",
        variant: "destructive",
      });
    }
  };

  // Configuration Airtable manquante
  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-thai py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <Alert className="border-amber-200 bg-amber-50">
            <Database className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Configuration requise :</strong> Veuillez d'abord configurer votre connexion Airtable pour traiter les demandes d'événements.
            </AlertDescription>
          </Alert>
          <div className="text-center mt-6">
            <Link to="/airtable-config">
              <Button className="bg-thai-orange hover:bg-thai-orange-dark">
                Configurer Airtable
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-thai py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <Card className="shadow-xl border-thai-orange/20">
          <CardHeader className="text-center bg-gradient-to-r from-thai-orange to-thai-gold text-white rounded-t-lg">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-8 w-8 mr-2" />
              <CardTitle className="text-3xl font-bold">Demande pour Groupe ou Événement</CardTitle>
            </div>
            <CardDescription className="text-white/90">
              Organisez votre événement avec nos menus personnalisés (minimum 10 personnes)
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <Alert className="mb-6 border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Service traiteur :</strong> Commande minimum 10 personnes • Préavis de 2 semaines requis • 
                Nous vous contacterons pour établir un menu personnalisé et un devis.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations de contact */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="text-thai-green font-medium">Email de contact *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    required
                    className="border-thai-orange/30 focus:border-thai-orange"
                    placeholder="votre.email@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactTelephone" className="text-thai-green font-medium">Téléphone</Label>
                  <Input
                    id="contactTelephone"
                    value={formData.contactTelephone}
                    onChange={(e) => handleInputChange('contactTelephone', e.target.value)}
                    className="border-thai-orange/30 focus:border-thai-orange"
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>

              {/* Informations de base */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomEvenement" className="text-thai-green font-medium">Nom de l'événement *</Label>
                  <Input
                    id="nomEvenement"
                    value={formData.nomEvenement}
                    onChange={(e) => handleInputChange('nomEvenement', e.target.value)}
                    required
                    className="border-thai-orange/30 focus:border-thai-orange"
                    placeholder="Ex: Anniversaire de Marie"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="typeEvenement" className="text-thai-green font-medium">Type d'événement *</Label>
                  <Select value={formData.typeEvenement} onValueChange={(value) => handleInputChange('typeEvenement', value)}>
                    <SelectTrigger className="border-thai-orange/30 focus:border-thai-orange">
                      <SelectValue placeholder="Sélectionnez le type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      {typesEvenements.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date de l'événement */}
              <div className="space-y-2">
                <Label className="text-thai-green font-medium">Date de l'événement *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-thai-orange/30",
                        !dateEvenement && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateEvenement ? format(dateEvenement, "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white z-50" align="start">
                    <Calendar
                      mode="single"
                      selected={dateEvenement}
                      onSelect={setDateEvenement}
                      disabled={(date) => {
                        const twoWeeksFromNow = new Date();
                        twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
                        return date < twoWeeksFromNow;
                      }}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-thai-green/60">
                  Minimum 2 semaines de préavis requis
                </p>
              </div>

              {/* Nombre de personnes et budget */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombrePersonnes" className="text-thai-green font-medium">Nombre de personnes *</Label>
                  <Input
                    id="nombrePersonnes"
                    type="number"
                    min="10"
                    value={formData.nombrePersonnes}
                    onChange={(e) => handleInputChange('nombrePersonnes', e.target.value)}
                    required
                    className="border-thai-orange/30 focus:border-thai-orange"
                    placeholder="Minimum 10 personnes"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budgetClient" className="text-thai-green font-medium">Budget approximatif</Label>
                  <Input
                    id="budgetClient"
                    value={formData.budgetClient}
                    onChange={(e) => handleInputChange('budgetClient', e.target.value)}
                    className="border-thai-orange/30 focus:border-thai-orange"
                    placeholder="Ex: 500€"
                  />
                </div>
              </div>

              {/* Sélection des plats */}
              {plats.length > 0 && (
                <div className="space-y-4">
                  <Label className="text-lg font-semibold text-thai-green">
                    Sélectionnez les plats qui vous intéressent :
                  </Label>
                  <div className="grid md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                    {plats.map(plat => (
                      <div key={plat.id} className="flex items-start space-x-3 p-3 border border-thai-orange/20 rounded-lg hover:bg-thai-cream/30 transition-colors">
                        <Checkbox
                          id={`plat-${plat.id}`}
                          checked={platsSelectionnes.includes(plat.id)}
                          onCheckedChange={() => togglePlatSelection(plat.id)}
                          className="border-thai-orange data-[state=checked]:bg-thai-orange mt-1"
                        />
                        <div className="flex-1">
                          <Label 
                            htmlFor={`plat-${plat.id}`} 
                            className="font-medium text-thai-green cursor-pointer"
                          >
                            {plat.nom}
                          </Label>
                          {plat.description && (
                            <p className="text-sm text-thai-green/70 mt-1">{plat.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {platsSelectionnes.length > 0 && (
                    <p className="text-sm text-thai-green/70">
                      {platsSelectionnes.length} plat(s) sélectionné(s)
                    </p>
                  )}
                </div>
              )}

              {/* Demandes spéciales */}
              <div className="space-y-2">
                <Label htmlFor="demandesSpeciales" className="text-thai-green font-medium">Demandes spéciales et détails</Label>
                <Textarea
                  id="demandesSpeciales"
                  value={formData.demandesSpeciales}
                  onChange={(e) => handleInputChange('demandesSpeciales', e.target.value)}
                  rows={4}
                  className="border-thai-orange/30 focus:border-thai-orange"
                  placeholder="Décrivez votre événement, vos besoins spécifiques, allergies, préférences, horaires souhaités, etc."
                />
              </div>

              {/* Note d'information */}
              <div className="bg-thai-cream/50 border border-thai-gold/30 rounded-lg p-4">
                <h4 className="font-semibold text-thai-green mb-2">📞 Processus de confirmation</h4>
                <p className="text-sm text-thai-green/80">
                  Après réception de votre demande, nous vous contacterons sous 24h pour :
                </p>
                <ul className="text-sm text-thai-green/80 mt-2 ml-4 list-disc space-y-1">
                  <li>Affiner le menu selon vos préférences</li>
                  <li>Établir un devis personnalisé</li>
                  <li>Confirmer les détails logistiques</li>
                  <li>Planifier la livraison ou le service</li>
                </ul>
              </div>

              <Button 
                type="submit" 
                disabled={createDemandeTraiteur.isPending || !formData.nomEvenement || !formData.typeEvenement || !dateEvenement || !formData.nombrePersonnes || !formData.contactEmail}
                className="w-full bg-thai-orange hover:bg-thai-orange-dark text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {createDemandeTraiteur.isPending ? 'Envoi en cours...' : 'Envoyer ma demande d\'événement'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Evenements;
