
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

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
            {/* Logo Integration */}
            <div className="mb-8">
              <img 
                src="/lovable-uploads/62d46b15-aa56-45d2-ab7d-75dfee70f70d.png" 
                alt="Chanthana Thai Cook Logo"
                className="w-32 h-32 mx-auto mb-6 rounded-full shadow-xl"
              />
            </div>
            
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

      {/* Cuisine Thaï Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-thai-green mb-6">CUISINE THAÏ</h2>
            </div>
            <div className="bg-gradient-to-br from-thai-cream to-white p-8 rounded-2xl shadow-lg border border-thai-orange/20">
              <p className="text-lg text-thai-green/80 leading-relaxed text-justify">
                La cuisine thaïlandaise est réputée dans le monde entier pour la maîtrise de l'équilibre des saveurs. 
                L'art du mariage du sucré, de l'aigre-doux, du salé et du piquant donne des plats d'une saveur étonnante. 
                Savourez des repas thaïlandais typiquement authentiques mixant une diversité d'ingrédients du riz, du poisson, 
                du poulet, des salades, des légumes et parfois même du porc ou du bœuf. Je propose des menus complets à emporter 
                et autres délices qui se renouvellent chaque semaine. Partez à la découverte de ces plats authentiques et 
                laissez-vous surprendre en les commandant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chanthana Thai Cook Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-thai-orange/5 to-thai-gold/5">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-thai-green mb-6">CHANTHANA THAI COOK</h2>
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-thai-orange/20">
                  <p className="text-lg text-thai-green/80 leading-relaxed text-justify">
                    J'ai quitté la Thaïlande pour m'installer en France par amour depuis 2002. Par amour pour ma famille, 
                    pour mon pays natal et surtout par passion pour la cuisine thaïlandaise, mon souhait est de vous faire 
                    découvrir la culture et la diversité des saveurs de la Thaïlande. Mon art originaire d'Isan, la région 
                    authentique Thaï qui garde ses secrets. Découvrez la véritable cuisine thaïlandaise.
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <img 
                  src="/lovable-uploads/ac918784-d65c-427a-9316-7598173177dd.png" 
                  alt="Chanthana en cuisine"
                  className="w-80 h-80 object-cover rounded-full shadow-2xl border-4 border-thai-orange/20"
                />
              </div>
            </div>
          </div>
        </div>
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

      {/* Contact Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-thai-green/10 to-thai-orange/10">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-thai-green mb-6">Nous Trouver</h2>
              <p className="text-xl text-thai-green/70">
                Venez découvrir nos saveurs authentiques
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-thai-orange/20">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-thai-orange mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-thai-green mb-1">Adresse</h3>
                      <p className="text-thai-green/70">
                        [Adresse à compléter]<br />
                        [Code postal] [Ville]
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Phone className="w-6 h-6 text-thai-orange mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-thai-green mb-1">Téléphone</h3>
                      <p className="text-thai-green/70">[Numéro à compléter]</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-thai-orange mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-thai-green mb-1">Email</h3>
                      <p className="text-thai-green/70">[Email à compléter]</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Clock className="w-6 h-6 text-thai-orange mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-thai-green mb-1">Horaires</h3>
                      <p className="text-thai-green/70">
                        Sur commande uniquement<br />
                        Mercredi et Samedi<br />
                        [Horaires à compléter]
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center items-center">
                  <img 
                    src="/lovable-uploads/d3c49259-a59d-45b8-9ad1-9d2f843b4562.png" 
                    alt="Carte de visite Chanthana Thai Cook"
                    className="max-w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
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
