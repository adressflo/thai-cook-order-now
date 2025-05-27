
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Home = () => {
  const features = [
    {
      title: "Cuisine Authentique",
      description: "Des recettes traditionnelles thaïlandaises préparées avec amour et des ingrédients frais",
      image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&h=300&fit=crop"
    },
    {
      title: "Commande Facile",
      description: "Commandez vos plats préférés en quelques clics pour une récupération rapide",
      image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop"
    },
    {
      title: "Événements Spéciaux",
      description: "Organisez vos événements avec nos menus personnalisés pour groupes",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-thai py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-thai-green mb-6">
              Bienvenue chez{' '}
              <span className="text-gradient">ChanthanaThaiCook</span>
            </h1>
            <p className="text-xl md:text-2xl text-thai-green/80 mb-8 leading-relaxed">
              Découvrez l'art culinaire thaïlandais authentique. Des saveurs traditionnelles 
              préparées avec passion pour éveiller vos sens.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-thai-orange hover:bg-thai-orange-dark text-white px-8 py-6 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
                <Link to="/commander">Commander Maintenant</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-thai-green text-thai-green hover:bg-thai-green hover:text-white px-8 py-6 text-lg rounded-xl">
                <Link to="/evenements">Organiser un Événement</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-thai-gold/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-thai-orange/20 rounded-full blur-xl"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-thai-green mb-4">
              Pourquoi Choisir ChanthanaThaiCook ?
            </h2>
            <p className="text-xl text-thai-green/70 max-w-2xl mx-auto">
              Une expérience culinaire exceptionnelle qui vous transporte directement en Thaïlande
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-thai-orange/20 overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-thai-green mb-3">{feature.title}</h3>
                  <p className="text-thai-green/70">{feature.description}</p>
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

export default Home;
