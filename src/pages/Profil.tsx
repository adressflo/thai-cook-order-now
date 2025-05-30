
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
import { CalendarIcon, User } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useCreateClient } from '@/hooks/useAirtable';

const Profil = () => {
  const { toast } = useToast();
  const createClient = useCreateClient();
  const [birthDate, setBirthDate] = useState<Date>();
  
  // Formulaire basé sur la structure exacte de Client DB
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    preferenceClient: '',
    numeroTelephone: '',
    email: '',
    adresseNumeroRue: '',
    codePostal: '',
    ville: '',
    commentConnuChanthana: [] as string[],
    newsletterActualites: false
  });

  // Options selon le cahier des charges exact
  const optionsCommentConnu = [
    'Bouche à oreille',
    'Réseaux sociaux',
    'Recherche Google',
    'En passant devant',
    'Recommandation d\'un ami',
    'Autre'
  ];

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCommentConnuChange = (option: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      commentConnuChanthana: checked 
        ? [...prev.commentConnuChanthana, option]
        : prev.commentConnuChanthana.filter(item => item !== option)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createClient.mutateAsync({
        ...formData,
        codePostal: formData.codePostal ? parseInt(formData.codePostal) : undefined,
        dateNaissance: birthDate?.toISOString().split('T')[0] // Format JJ/MM/AAAA sera géré par Airtable
      });
      
      toast({
        title: "Profil créé avec succès !",
        description: "Vos informations ont été enregistrées dans notre base de données.",
      });

      // Réinitialiser le formulaire
      setFormData({
        nom: '',
        prenom: '',
        preferenceClient: '',
        numeroTelephone: '',
        email: '',
        adresseNumeroRue: '',
        codePostal: '',
        ville: '',
        commentConnuChanthana: [],
        newsletterActualites: false
      });
      setBirthDate(undefined);
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la création du profil.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-thai py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Photo Client en haut */}
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/7dca2e51-98dd-4f91-a1a5-5f636ab9fcb1.png" 
            alt="Photo Client"
            className="w-24 h-24 mx-auto mb-4 rounded-full shadow-xl"
          />
        </div>

        <Card className="shadow-xl border-thai-orange/20">
          <CardHeader className="text-center bg-gradient-to-r from-thai-orange to-thai-gold text-white rounded-t-lg">
            <div className="flex items-center justify-center mb-2">
              <User className="h-8 w-8 mr-2" />
              <CardTitle className="text-3xl font-bold">Mon Profil</CardTitle>
            </div>
            <CardDescription className="text-white/90">
              Créez votre profil client pour passer commande facilement
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations personnelles selon structure Client DB */}
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
                  <Label htmlFor="numeroTelephone" className="text-thai-green font-medium">Numéro de téléphone *</Label>
                  <Input
                    id="numeroTelephone"
                    type="tel"
                    value={formData.numeroTelephone}
                    onChange={(e) => handleInputChange('numeroTelephone', e.target.value)}
                    required
                    className="border-thai-orange/30 focus:border-thai-orange"
                  />
                </div>
              </div>

              {/* Adresse selon structure exacte */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adresseNumeroRue" className="text-thai-green font-medium">Adresse (numéro et rue)</Label>
                  <Input
                    id="adresseNumeroRue"
                    value={formData.adresseNumeroRue}
                    onChange={(e) => handleInputChange('adresseNumeroRue', e.target.value)}
                    placeholder="12 rue de la Paix"
                    className="border-thai-orange/30 focus:border-thai-orange"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="codePostal" className="text-thai-green font-medium">Code Postal</Label>
                    <Input
                      id="codePostal"
                      type="number"
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

              {/* Préférences client (allergies, végan, etc.) */}
              <div className="space-y-2">
                <Label htmlFor="preferenceClient" className="text-thai-green font-medium">Préférence client</Label>
                <Textarea
                  id="preferenceClient"
                  value={formData.preferenceClient}
                  onChange={(e) => handleInputChange('preferenceClient', e.target.value)}
                  rows={3}
                  className="border-thai-orange/30 focus:border-thai-orange"
                  placeholder="Allergies récurrentes, si vous êtes végan, votre plat préféré, ou toute autre note spécifique..."
                />
              </div>

              {/* Comment nous avez-vous connu (choix multiples) */}
              <div className="space-y-3">
                <Label className="text-thai-green font-medium">Comment avez-vous connu ChanthanaThaiCook ?</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {optionsCommentConnu.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`connu-${option}`}
                        checked={formData.commentConnuChanthana.includes(option)}
                        onCheckedChange={(checked) => handleCommentConnuChange(option, checked as boolean)}
                        className="border-thai-orange data-[state=checked]:bg-thai-orange"
                      />
                      <Label htmlFor={`connu-${option}`} className="text-sm text-thai-green">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="newsletter"
                  checked={formData.newsletterActualites}
                  onCheckedChange={(checked) => handleInputChange('newsletterActualites', checked as boolean)}
                  className="border-thai-orange data-[state=checked]:bg-thai-orange"
                />
                <Label htmlFor="newsletter" className="text-thai-green text-sm">
                  Souhaitez-vous recevoir les actualités et offres par e-mail ?
                </Label>
              </div>

              {/* Mention RGPD */}
              <div className="bg-thai-cream/30 p-4 rounded-lg">
                <p className="text-sm text-thai-green/80">
                  <strong>Protection des données :</strong> Les données collectées sont utilisées exclusivement pour le traitement des commandes.
                </p>
              </div>

              <Button 
                type="submit" 
                disabled={createClient.isPending || !formData.nom || !formData.prenom || !formData.email || !formData.numeroTelephone}
                className="w-full bg-thai-orange hover:bg-thai-orange-dark text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {createClient.isPending ? 'Création...' : 'Créer mon profil client'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profil;
