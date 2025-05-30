import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { usePlats, useCreateEvenement } from '@/hooks/useAirtable';

const Evenements = () => {
  const { toast } = useToast();
  const { plats, isLoading: platsLoading } = usePlats();
  const createEvenement = useCreateEvenement();
  const [dateEvenement, setDateEvenement] = useState<Date>();
  const [platsPreselectionnes, setPlatsPreselectionnes] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    nomEvenement: '',
    typeEvenement: '',
    nombrePersonnes: '',
    budgetClient: '',
    demandesSpeciales: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlatPreselectionneChange = (platId: string, checked: boolean) => {
    setPlatsPreselectionnes(prev => {
      if (checked) {
        return [...prev, platId];
      } else {
        return prev.filter(id => id !== platId);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dateEvenement) {
      toast({
        title: "Date manquante",
        description: "Veuillez sélectionner une date pour votre événement.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createEvenement.mutateAsync({
        ...formData,
        dateEvenement: dateEvenement.toISOString(),
        platsPreselectionnes,
        nombrePersonnes: parseInt(formData.nombrePersonnes),
        budgetClient: parseFloat(formData.budgetClient)
      });
      
      toast({
        title: "Demande envoyée !",
        description: "Votre demande d'événement a été enregistrée. Nous vous recontacterons rapidement.",
      });
      
      // Reset form
      setFormData({
        nomEvenement: '',
        typeEvenement: '',
        nombrePersonnes: '',
        budgetClient: '',
        demandesSpeciales: ''
      });
      setDateEvenement(undefined);
      setPlatsPreselectionnes([]);
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'envoi de votre demande.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-thai py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-xl border-thai-orange/20">
          <CardHeader className="text-center bg-gradient-to-r from-thai-orange to-thai-gold text-white rounded-t-lg">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="h-8 w-8 mr-2" />
              <CardTitle className="text-3xl font-bold">Pour vos Événements</CardTitle>
            </div>
            <CardDescription className="text-white/90">
              Organisez vos événements avec nos menus personnalisés pour groupes
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom de l'événement */}
              <div className="space-y-2">
                <Label htmlFor="nomEvenement" className="text-thai-green font-medium">Nom de l'événement *</Label>
                <Input
                  id="nomEvenement"
                  value={formData.nomEvenement}
                  onChange={(e) => handleInputChange('nomEvenement', e.target.value)}
                  required
                  className="border-thai-orange/30 focus:border-thai-orange"
                />
              </div>

              {/* Type d'événement */}
              <div className="space-y-2">
                <Label htmlFor="typeEvenement" className="text-thai-green font-medium">Type d'événement *</Label>
                <Select value={formData.typeEvenement} onValueChange={(value) => handleInputChange('typeEvenement', value)}>
                  <SelectTrigger className="w-full border-thai-orange/30 focus:border-thai-orange">
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="mariage">Mariage</SelectItem>
                    <SelectItem value="anniversaire">Anniversaire</SelectItem>
                    <SelectItem value="reunion">Réunion</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
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

              {/* Nombre de personnes */}
              <div className="space-y-2">
                <Label htmlFor="nombrePersonnes" className="text-thai-green font-medium">Nombre de personnes *</Label>
                <Input
                  id="nombrePersonnes"
                  type="number"
                  value={formData.nombrePersonnes}
                  onChange={(e) => handleInputChange('nombrePersonnes', e.target.value)}
                  required
                  className="border-thai-orange/30 focus:border-thai-orange"
                />
              </div>

              {/* Budget du client */}
              <div className="space-y-2">
                <Label htmlFor="budgetClient" className="text-thai-green font-medium">Budget du client</Label>
                <Input
                  id="budgetClient"
                  type="number"
                  value={formData.budgetClient}
                  onChange={(e) => handleInputChange('budgetClient', e.target.value)}
                  placeholder="En euros (€)"
                  className="border-thai-orange/30 focus:border-thai-orange"
                />
              </div>

              {/* Plats présélectionnés */}
              <div className="space-y-3">
                <Label className="text-thai-green font-medium">Plats présélectionnés</Label>
                {platsLoading ? (
                  <p className="text-thai-green/70">Chargement des plats...</p>
                ) : (
                  <div className="grid md:grid-cols-2 gap-3">
                    {plats?.map(plat => (
                      <div key={plat.id} className="flex items-center space-x-2">
                        <Input
                          type="checkbox"
                          id={`plat-${plat.id}`}
                          checked={platsPreselectionnes.includes(plat.id)}
                          onChange={(e) => handlePlatPreselectionneChange(plat.id, e.target.checked)}
                          className="border-thai-orange data-[state=checked]:bg-thai-orange"
                        />
                        <Label htmlFor={`plat-${plat.id}`} className="text-sm text-thai-green">
                          {plat.plat}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Demandes spéciales */}
              <div className="space-y-2">
                <Label htmlFor="demandesSpeciales" className="text-thai-green font-medium">Demandes spéciales</Label>
                <Textarea
                  id="demandesSpeciales"
                  value={formData.demandesSpeciales}
                  onChange={(e) => handleInputChange('demandesSpeciales', e.target.value)}
                  rows={3}
                  className="border-thai-orange/30 focus:border-thai-orange"
                  placeholder="Allergies, préférences, etc."
                />
              </div>

              <Button 
                type="submit" 
                disabled={createEvenement.isPending || !formData.nomEvenement || !formData.typeEvenement || !dateEvenement}
                className="w-full bg-thai-orange hover:bg-thai-orange-dark text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {createEvenement.isPending ? 'Envoi...' : 'Envoyer ma demande d\'événement'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Evenements;
