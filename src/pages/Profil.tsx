
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const Profil = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [birthDate, setBirthDate] = useState<Date>();
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    preference: '',
    telephone: '',
    email: '',
    adresse: '',
    codePostal: '',
    ville: '',
    commentConnu: '',
    newsletter: false,
    demandesSpeciales: ''
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulation d'envoi vers webhook n8n
      console.log('Données envoyées vers n8n:', {
        ...formData,
        dateNaissance: birthDate,
        timestamp: new Date().toISOString()
      });
      
      // Ici, vous ajouterez l'appel réel vers votre webhook n8n
      // const response = await fetch('VOTRE_WEBHOOK_N8N_URL', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...formData, dateNaissance: birthDate })
      // });
      
      toast({
        title: "Profil mis à jour avec succès !",
        description: "Vos informations ont été sauvegardées.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-thai py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="shadow-xl border-thai-orange/20">
          <CardHeader className="text-center bg-gradient-to-r from-thai-orange to-thai-gold text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold">Mon Profil</CardTitle>
            <CardDescription className="text-white/90">
              Gérez vos informations personnelles et préférences
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations personnelles */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom" className="text-thai-green font-medium">Nom *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => handleInputChange('nom', e.target.value)}
                    required
                    className="border-thai-orange/30 focus:border-thai-orange"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prenom" className="text-thai-green font-medium">Prénom *</Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => handleInputChange('prenom', e.target.value)}
                    required
                    className="border-thai-orange/30 focus:border-thai-orange"
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-thai-green font-medium">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className="border-thai-orange/30 focus:border-thai-orange"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone" className="text-thai-green font-medium">Téléphone</Label>
                  <Input
                    id="telephone"
                    value={formData.telephone}
                    onChange={(e) => handleInputChange('telephone', e.target.value)}
                    className="border-thai-orange/30 focus:border-thai-orange"
                  />
                </div>
              </div>

              {/* Adresse */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adresse" className="text-thai-green font-medium">Adresse</Label>
                  <Input
                    id="adresse"
                    value={formData.adresse}
                    onChange={(e) => handleInputChange('adresse', e.target.value)}
                    placeholder="Numéro et rue"
                    className="border-thai-orange/30 focus:border-thai-orange"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="codePostal" className="text-thai-green font-medium">Code Postal</Label>
                    <Input
                      id="codePostal"
                      value={formData.codePostal}
                      onChange={(e) => handleInputChange('codePostal', e.target.value)}
                      className="border-thai-orange/30 focus:border-thai-orange"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ville" className="text-thai-green font-medium">Ville</Label>
                    <Input
                      id="ville"
                      value={formData.ville}
                      onChange={(e) => handleInputChange('ville', e.target.value)}
                      className="border-thai-orange/30 focus:border-thai-orange"
                    />
                  </div>
                </div>
              </div>

              {/* Date de naissance */}
              <div className="space-y-2">
                <Label className="text-thai-green font-medium">Date de naissance</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-thai-orange/30",
                        !birthDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {birthDate ? format(birthDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white z-50" align="start">
                    <Calendar
                      mode="single"
                      selected={birthDate}
                      onSelect={setBirthDate}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Préférences */}
              <div className="space-y-2">
                <Label htmlFor="preference" className="text-thai-green font-medium">Préférences alimentaires</Label>
                <Select value={formData.preference} onValueChange={(value) => handleInputChange('preference', value)}>
                  <SelectTrigger className="border-thai-orange/30 focus:border-thai-orange">
                    <SelectValue placeholder="Sélectionnez vos préférences" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="aucune">Aucune restriction</SelectItem>
                    <SelectItem value="vegetarien">Végétarien</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="sans-gluten">Sans gluten</SelectItem>
                    <SelectItem value="halal">Halal</SelectItem>
                    <SelectItem value="autre">Autre (préciser en commentaire)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Comment nous avez-vous connu */}
              <div className="space-y-2">
                <Label htmlFor="commentConnu" className="text-thai-green font-medium">Comment nous avez-vous connu ?</Label>
                <Select value={formData.commentConnu} onValueChange={(value) => handleInputChange('commentConnu', value)}>
                  <SelectTrigger className="border-thai-orange/30 focus:border-thai-orange">
                    <SelectValue placeholder="Sélectionnez une option" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="bouche-oreille">Bouche à oreille</SelectItem>
                    <SelectItem value="reseaux-sociaux">Réseaux sociaux</SelectItem>
                    <SelectItem value="google">Recherche Google</SelectItem>
                    <SelectItem value="passage">En passant devant</SelectItem>
                    <SelectItem value="ami">Recommandation d'un ami</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Demandes spéciales */}
              <div className="space-y-2">
                <Label htmlFor="demandesSpeciales" className="text-thai-green font-medium">Demandes spéciales ou commentaires</Label>
                <Textarea
                  id="demandesSpeciales"
                  value={formData.demandesSpeciales}
                  onChange={(e) => handleInputChange('demandesSpeciales', e.target.value)}
                  rows={3}
                  className="border-thai-orange/30 focus:border-thai-orange"
                  placeholder="Allergies, préférences particulières, commentaires..."
                />
              </div>

              {/* Newsletter */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="newsletter"
                  checked={formData.newsletter}
                  onCheckedChange={(checked) => handleInputChange('newsletter', checked as boolean)}
                  className="border-thai-orange data-[state=checked]:bg-thai-orange"
                />
                <Label htmlFor="newsletter" className="text-thai-green text-sm">
                  Je souhaite recevoir les actualités et offres spéciales par email
                </Label>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-thai-orange hover:bg-thai-orange-dark text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? 'Sauvegarde...' : 'Sauvegarder mon profil'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profil;
