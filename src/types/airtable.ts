
export interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
  createdTime: string;
}

export interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

export interface AirtableConfig {
  apiKey: string;
  baseId: string;
  tableName: string;
}

export interface Client {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  dateNaissance?: string;
  preferences?: string;
  createdTime: string;
  statut?: 'Actif' | 'Inactif' | 'VIP'; // RBAC niveau client
}

export interface Plat {
  id: string;
  nom: string;
  description?: string;
  prix?: number;
  categorie?: 'Entrée' | 'Plat' | 'Dessert' | 'Macaron'; // Champs Select selon V2.0
  ingredients?: string;
  disponible?: boolean;
  image?: string;
  allergenes?: string;
  // Disponibilité par jour selon le cahier des charges V2.0
  lundi_dispo?: string;
  mardi_dispo?: string;
  mercredi_dispo?: string;
  jeudi_dispo?: string;
  vendredi_dispo?: string;
  samedi_dispo?: string;
  dimanche_dispo?: string;
  // Nouvelles propriétés V2.0
  platsRestants?: number; // Linked Records vers table Stocks
  coutMatiere?: number; // Rollup calculé automatiquement
  niveauPiment?: 1 | 2 | 3 | 4 | 5; // Niveau personnalisé
  tagsRegime?: string[]; // Tags de régime alimentaire
  createdTime: string;
}

export interface Commande {
  id: string;
  clientEmail: string;
  panier: Array<{
    id: number;
    nom: string;
    prix: number;
    quantite: number;
  }>;
  total: number;
  dateRetrait: string;
  heureRetrait: string;
  demandesSpeciales?: string;
  statut: 'Étape 1: Soumission' | 'Étape 2: Vérification stocks' | 'Étape 3: Confirmation client' | 'Étape 4: Préparation cuisine' | 'Prêt' | 'Collecté' | 'Annulé';
  dateCommande: string;
  typeCommande?: 'Individuelle' | 'Groupe';
  validationRequired?: boolean;
  workflowStep?: string;
}

export interface DemandeTraiteur {
  id: string;
  nomEvenement: string;
  typeEvenement: string;
  dateEvenement: string;
  nombrePersonnes: number;
  budgetClient?: string;
  platsSelectionnes: any[];
  demandesSpeciales?: string;
  statut: 'Nouvelle' | 'En cours' | 'Devis envoyé' | 'Confirmée' | 'Terminée' | 'Annulée';
  dateDemande: string;
  contactEmail: string;
  contactTelephone?: string;
  validationRBAC?: 'Manager Required' | 'Admin Required' | 'Validated';
  workflowStep?: string;
}

// Nouvelles interfaces pour V2.0
export interface Stock {
  id: string;
  ingredient: string;
  quantiteActuelle: number;
  seuilAlerte: number; // Automatiquement à 20% selon V2.0
  dernierReassort: string;
  fournisseur?: string;
}

export interface Analytics {
  totalCommandes: number;
  commandesAujourdhui: number;
  totalClients: number;
  timestamp: string;
  kpiTempsReel?: {
    revenus: number;
    platsPlusPopulaires: string[];
    tauxFidelisation: number;
  };
}

export interface AutomationRule {
  id: string;
  nom: string;
  declencheur: string;
  conditions: Record<string, any>;
  actions: string[];
  actif: boolean;
  derniereDeclenchement?: string;
}

// Types pour la hiérarchie RBAC (5 niveaux)
export type RoleUtilisateur = 'Client' | 'Cuisinier' | 'Manager' | 'Administrateur' | 'Super Admin';

export interface UtilisateurRBAC {
  id: string;
  email: string;
  role: RoleUtilisateur;
  permissions: string[];
  dernierAcces: string;
  actif: boolean;
}

// Types pour la sécurité avancée V2.0
export interface AuditLog {
  id: string;
  utilisateur: string;
  action: string;
  ressource: string;
  timestamp: string;
  adresseIP?: string;
  resultat: 'Succès' | 'Échec';
  details?: Record<string, any>;
}

export interface ConfigurationSecurite {
  chiffrementAES: boolean;
  rotationCles: 'Hebdomadaire' | 'Mensuelle';
  sauvegardeMutliCloud: boolean;
  replicationCrossRegion: boolean;
  limiteurAPI: number; // Requêtes par minute (100 selon V2.0)
}
