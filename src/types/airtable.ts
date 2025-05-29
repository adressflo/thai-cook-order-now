
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
}

export interface Plat {
  id: string;
  nom: string;
  description?: string;
  prix?: number;
  categorie?: string;
  ingredients?: string;
  disponible?: boolean;
  image?: string;
  allergenes?: string;
  // Disponibilité par jour selon le cahier des charges
  lundi_dispo?: string;
  mardi_dispo?: string;
  mercredi_dispo?: string;
  jeudi_dispo?: string;
  vendredi_dispo?: string;
  samedi_dispo?: string;
  dimanche_dispo?: string;
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
  statut: string;
  dateCommande: string;
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
  statut: string;
  dateDemande: string;
}
