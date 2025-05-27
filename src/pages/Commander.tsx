
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

// Simulation de données de plats (à remplacer par les vraies données Airtable)
const platsSimulation = [
  {
    id: 1,
    nom: "Pad Thaï aux Crevettes",
    description: "Nouilles de riz sautées aux crevettes, germes de soja, œuf et sauce tamarind",
    prix: 14.50,
    image: "https://images.unsplash.com/photo-1559847844-d418898f7c5c?w=300&h=200&fit=crop",
    lundi_dispo: "oui",
    mardi_dispo: "oui",
    mercredi_dispo: "non",
    jeudi_dispo: "oui",
    vendredi_dispo: "oui",
    samedi_dispo: "oui",
    dimanche_dispo: "non"
  },
  {
    id: 2,
    nom: "Tom Yum Kung",
    description: "Soupe épicée et acidulée aux crevettes, champignons et citronnelle",
    prix: 12.00,
    image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=300&h=200&fit=crop",
    lundi_dispo: "oui",
    mardi_dispo: "oui",
    mercredi_dispo: "oui",
    jeudi_dispo: "non",
    vendredi_dispo: "oui",
    samedi_dispo: "oui",
    dimanche_dispo: "oui"
  },
  {
    id: 3,
    nom: "Curry Vert au Poulet",
    description: "Curry traditionnel au lait de coco, basilic thaï et légumes",
    prix: 13.80,
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=300&h=200&fit=crop",
    lundi_dispo: "oui",
    mardi_dispo: "non",
    mercredi_dispo: "oui",
    jeudi_dispo: "oui",
    vendredi_dispo: "oui",
    samedi_dispo: "oui",
    dimanche_dispo: "oui"
  },
  {
    id: 4,
    nom: "Som Tam (Salade de Papaye)",
    description: "Salade fraîche de papaye verte, tomates cerises, haricots verts et cacahuètes",
    prix: 9.50,
    image: "https://images.unsplash.com/photo-1596040033229-a40b85dee531?w=300&h=200&fit=crop",
    lundi_dispo: "non",
    mardi_dispo: "oui",
    mercredi_dispo: "oui",
    jeudi_dispo: "oui",
    vendredi_dispo: "oui",
    samedi_dispo: "oui",
    dimanche_dispo: "non"
  }
];

interface PlatPanier {
  id: number;
  nom: string;
  prix: number;
  quantite: number;
}

const Commander = () => {
  const { toast } = useToast();
  const [jourSelectionne, setJourSelectionne] = useState<string>('');
  const [panier, setPanier] = useState<PlatPanier[]>([]);
  const [dateRetrait, setDateRetrait] = useState<Date>();
  const [heureRetrait, setHeureRetrait] = useState<string>('');
  const [demandesSpeciales, setDemandesSpeciales] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const jours = [
    { value: 'lundi', label: 'Lundi' },
    { value: 'mardi', label: 'Mardi' },
    { value: 'mercredi', label: 'Mercredi' },
    { value: 'jeudi', label: 'Jeudi' },
    { value: 'vendredi', label: 'Vendredi' },
    { value: 'samedi', label: 'Samedi' },
    { value: 'dimanche', label: 'Dimanche' }
  ];

  const heuresDisponibles = [
    '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
    '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
  ];

  const platsDisponibles = platsSimulation.filter(plat => {
    if (!jourSelectionne) return false;
    const cleDisponibilite = `${jourSelectionne}_dispo` as keyof typeof plat;
    return plat[cleDisponibilite] === 'oui';
  });

  const ajouterAuPanier = (plat: typeof platsSimulation[0]) => {
    setPanier(prev => {
      const platExistant = prev.find(p => p.id === plat.id);
      if (platExistant) {
        return prev.map(p => 
          p.id === plat.id 
            ? { ...p, quantite: p.quantite + 1 }
            : p
        );
      } else {
        return [...prev, { id: plat.id, nom: plat.nom, prix: plat.prix, quantite: 1 }];
      }
    });
    
    toast({
      title: "Plat ajouté !",
      description: `${plat.nom} a été ajouté à votre panier.`,
    });
  };

  const modifierQuantite = (id: number, nouvelleQuantite: number) => {
    if (nouvelleQuantite === 0) {
      setPanier(prev => prev.filter(p => p.id !== id));
    } else {
      setPanier(prev => prev.map(p => 
        p.id === id 
          ? { ...p, quantite: nouvelleQuantite }
          : p
      ));
    }
  };

  const calculerTotal = () => {
    return panier.reduce((total, plat) => total + (plat.prix * plat.quantite), 0).toFixed(2);
  };

  const validerCommande = async () => {
    if (panier.length === 0) {
      toast({
        title: "Panier vide",
        description: "Veuillez ajouter des plats à votre panier.",
        variant: "destructive",
      });
      return;
    }

    if (!dateRetrait || !heureRetrait) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez sélectionner une date et heure de retrait.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const commande = {
        panier: panier,
        dateRetrait: dateRetrait,
        heureRetrait: heureRetrait,
        demandesSpeciales: demandesSpeciales,
        total: calculerTotal(),
        timestamp: new Date().toISOString()
      };

      console.log('Commande envoyée vers n8n:', commande);
      
      // Ici, vous ajouterez l'appel réel vers votre webhook n8n
      // const response = await fetch('VOTRE_WEBHOOK_N8N_COMMANDE_URL', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(commande)
      // });
      
      toast({
        title: "Commande confirmée !",
        description: `Votre commande de ${calculerTotal()}€ a été enregistrée. Vous recevrez une confirmation par email.`,
      });
      
      // Réinitialiser le formulaire
      setPanier([]);
      setDateRetrait(undefined);
      setHeureRetrait('');
      setDemandesSpeciales('');
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre commande.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-thai py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-xl border-thai-orange/20 mb-8">
          <CardHeader className="text-center bg-gradient-to-r from-thai-orange to-thai-gold text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold">Commander à la Carte</CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            {/* Sélection du jour */}
            <div className="mb-8">
              <Label className="text-lg font-semibold text-thai-green mb-4 block">
                Choisissez un jour pour voir le menu disponible :
              </Label>
              <Select value={jourSelectionne} onValueChange={setJourSelectionne}>
                <SelectTrigger className="w-full border-thai-orange/30 focus:border-thai-orange">
                  <SelectValue placeholder="Sélectionnez un jour" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {jours.map(jour => (
                    <SelectItem key={jour.value} value={jour.value}>
                      {jour.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Affichage des plats disponibles */}
            {jourSelectionne && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-thai-green mb-4">
                  Plats disponibles le {jours.find(j => j.value === jourSelectionne)?.label.toLowerCase()} :
                </h3>
                
                {platsDisponibles.length === 0 ? (
                  <p className="text-thai-green/70 text-center py-8">
                    Aucun plat disponible ce jour-là. Veuillez choisir un autre jour.
                  </p>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {platsDisponibles.map(plat => (
                      <Card key={plat.id} className="border-thai-orange/20 hover:shadow-lg transition-shadow duration-300">
                        <div className="aspect-video overflow-hidden rounded-t-lg">
                          <img 
                            src={plat.image} 
                            alt={plat.nom}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-thai-green mb-2">{plat.nom}</h4>
                          <p className="text-sm text-thai-green/70 mb-3">{plat.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="bg-thai-gold/20 text-thai-green">
                              {plat.prix.toFixed(2)}€
                            </Badge>
                            <Button 
                              onClick={() => ajouterAuPanier(plat)}
                              size="sm"
                              className="bg-thai-orange hover:bg-thai-orange-dark"
                            >
                              Ajouter
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Panier */}
            {panier.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-thai-green mb-4">Mon Panier :</h3>
                <div className="space-y-3 mb-4">
                  {panier.map(plat => (
                    <div key={plat.id} className="flex items-center justify-between bg-thai-cream/50 p-3 rounded-lg">
                      <div>
                        <span className="font-medium text-thai-green">{plat.nom}</span>
                        <span className="text-thai-green/70 ml-2">({plat.prix.toFixed(2)}€)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => modifierQuantite(plat.id, plat.quantite - 1)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{plat.quantite}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => modifierQuantite(plat.id, plat.quantite + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-thai-green">
                    Total: {calculerTotal()}€
                  </span>
                </div>
              </div>
            )}

            {/* Informations de retrait */}
            {panier.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-thai-green">Informations de retrait :</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-thai-green font-medium">Date de retrait *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal border-thai-orange/30",
                            !dateRetrait && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRetrait ? format(dateRetrait, "PPP", { locale: fr }) : "Sélectionner une date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white z-50" align="start">
                        <Calendar
                          mode="single"
                          selected={dateRetrait}
                          onSelect={setDateRetrait}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-thai-green font-medium">Heure de retrait *</Label>
                    <Select value={heureRetrait} onValueChange={setHeureRetrait}>
                      <SelectTrigger className="border-thai-orange/30 focus:border-thai-orange">
                        <SelectValue placeholder="Sélectionnez une heure" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        {heuresDisponibles.map(heure => (
                          <SelectItem key={heure} value={heure}>{heure}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-thai-green font-medium">Demandes spéciales</Label>
                  <Textarea
                    value={demandesSpeciales}
                    onChange={(e) => setDemandesSpeciales(e.target.value)}
                    rows={3}
                    className="border-thai-orange/30 focus:border-thai-orange"
                    placeholder="Allergies, préférences de cuisson, etc."
                  />
                </div>

                <Button 
                  onClick={validerCommande}
                  disabled={isLoading}
                  className="w-full bg-thai-orange hover:bg-thai-orange-dark text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? 'Validation...' : `Valider ma commande (${calculerTotal()}€)`}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Commander;
