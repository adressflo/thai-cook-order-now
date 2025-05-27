
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

// Simulation de plats pour sélection événement (sans prix affichés)
const platsEvenements = [
  { id: 1, nom: "Pad Thaï aux Crevettes", description: "Nouilles de riz sautées aux crevettes" },
  { id: 2, nom: "Tom Yum Kung", description: "Soupe épicée et acidulée aux crevettes" },
  { id: 3, nom: "Curry Vert au Poulet", description: "Curry traditionnel au lait de coco" },
  { id: 4, nom: "Som Tam", description: "Salade fraîche de papaye verte" },
  { id: 5, nom: "Massaman Curry", description: "Curry doux aux cacahuètes" },
  { id: 6, nom: "Larb Gai", description: "Salade de poulet épicée" },
  { id: 7, nom: "Mango Sticky Rice", description: "Riz gluant à la mangue" },
  { id: 8, nom: "Spring Rolls", description: "Rouleaux de printemps frais" }
];

const Evenements = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [dateEvenement, setDateEvenement] = useState<Date>();
  const [platsSelectionnes, setPlatsSelectionnes] = useState<number[]>([]);
  
  const [formData, setFormData] = useState({
    nomEvenement: '',
    typeEvenement: '',
    nombrePersonnes: '',
    budgetClient: '',
    demandesSpeciales: ''
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

  const togglePlatSelection = (platId: number) => {
    setPlatsSelectionnes(prev => 
      prev.includes(platId)
        ? prev.filter(id => id !== platId)
        : [...prev, platId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const platsSelectionnesDetails = platsEvenements.filter(plat => 
        platsSelectionnes.includes(plat.id)
      );

      const evenement = {
        ...formData,
        dateEvenement: dateEvenement,
        platsSelectionnes: platsSelectionnesDetails,
        timestamp: new Date().toISOString()
      };

      console.log('Demande d\'événement envoyée vers n8n:', evenement);
      
      // Ici, vous ajouterez l'appel réel vers votre webhook n8n
      // const response = await fetch('VOTRE_WEBHOOK_N8N_EVENEMENT_URL', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(evenement)
      // });
      
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
        demandesSpeciales: ''
      });
      setDateEvenement(undefined);
      setPlatsSelectionnes([]);
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre demande.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-thai py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <Card className="shadow-xl border-thai-orange/20">
          <CardHeader className="text-center bg-gradient-to-r from-thai-orange to-thai-gold text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold">Demande pour Groupe ou Événement</CardTitle>
            <CardDescription className="text-white/90">
              Organisez votre événement avec nos menus personnalisés
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Nombre de personnes et budget */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombrePersonnes" className="text-thai-green font-medium">Nombre de personnes *</Label>
                  <Input
                    id="nombrePersonnes"
                    type="number"
                    min="1"
                    value={formData.nombrePersonnes}
                    onChange={(e) => handleInputChange('nombrePersonnes', e.target.value)}
                    required
                    className="border-thai-orange/30 focus:border-thai-orange"
                    placeholder="Ex: 25"
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
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-thai-green">Sélectionnez les plats qui vous intéressent :</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {platsEvenements.map(plat => (
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
                        <p className="text-sm text-thai-green/70 mt-1">{plat.description}</p>
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
                disabled={isLoading || !formData.nomEvenement || !formData.typeEvenement || !dateEvenement || !formData.nombrePersonnes}
                className="w-full bg-thai-orange hover:bg-thai-orange-dark text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? 'Envoi en cours...' : 'Envoyer ma demande d\'événement'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Evenements;
