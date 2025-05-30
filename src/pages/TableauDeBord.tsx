
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Utensils, Calendar, MapPin, User, Users, Heart } from 'lucide-react';

const TableauDeBord = () => {
  const sections = [
    {
      title: "Pour Commander",
      description: "Découvrez notre menu authentique et passez votre commande",
      image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&h=300&fit=crop",
      link: "/commander",
      icon: Utensils
    },
    {
      title: "Pour vos Événements",
      description: "Organisez vos événements avec nos menus personnalisés",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
      link: "/evenements",
      icon: Calendar
    },
    {
      title: "Nous Trouver",
      description: "Venez nous rendre visite à Marigny-Marmande",
      image: "/lovable-uploads/c05e254c-51c0-4574-b2ab-2dac828ea413.png",
      link: "/nous-trouver",
      icon: MapPin
    },
    {
      title: "Mon Profil",
      description: "Gérez vos informations personnelles et préférences",
      image: "/lovable-uploads/7dca2e51-98dd-4f91-a1a5-5f636ab9fcb1.png",
      link: "/profil",
      icon: User
    },
    {
      title: "À propos de nous",
      description: "Découvrez notre histoire et notre passion",
      image: "/lovable-uploads/ac918784-d65c-427a-9316-7598173177dd.png",
      link: "/a-propos",
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-thai">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="mb-8">
              <img 
                src="/lovable-uploads/62d46b15-aa56-45d2-ab7d-75dfee70f70d.png" 
                alt="Chanthana Thai Cook Logo"
                className="w-32 h-32 mx-auto mb-6 rounded-full shadow-xl"
              />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-thai-green mb-6">
              Bienvenue chez{' '}
              <span className="text-gradient">ChanthanaThaiCook</span>
            </h1>
            <p className="text-xl md:text-2xl text-thai-green/80 mb-8 leading-relaxed">
              Une expérience culinaire exceptionnelle qui vous transporte directement en Thaïlande
            </p>
          </div>
        </div>
      </section>

      {/* Sections Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {sections.map((section, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-thai-orange/20 overflow-hidden">
                <div className="aspect-video overflow-hidden relative">
                  <img 
                    src={section.image} 
                    alt={section.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <section.icon className="absolute top-4 right-4 h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-thai-green mb-3">{section.title}</h3>
                  <p className="text-thai-green/70 mb-4">{section.description}</p>
                  <Button asChild variant="outline" className="border-thai-orange text-thai-orange hover:bg-thai-orange hover:text-white w-full">
                    <Link to={section.link}>Découvrir</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-thai-orange to-thai-gold">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto text-white">
            <Heart className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6">
              Prêt à Savourer l'Authenticité Thaïlandaise ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Créez votre profil et découvrez nos menus quotidiens préparés avec des ingrédients frais et des recettes traditionnelles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="bg-white text-thai-orange hover:bg-thai-cream px-8 py-6 text-lg rounded-xl">
                <Link to="/profil">Créer Mon Profil</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-thai-orange px-8 py-6 text-lg rounded-xl">
                <Link to="/commander">Voir le Menu</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TableauDeBord;
