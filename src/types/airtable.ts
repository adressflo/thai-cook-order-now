
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
  createdTime: string;
}
