
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { airtableService } from '@/services/airtableService';
import { AirtableConfig, Client, Plat } from '@/types/airtable';

export const useAirtableConfig = () => {
  const [config, setConfig] = useState<AirtableConfig | null>(() => {
    const saved = localStorage.getItem('airtable-config');
    return saved ? JSON.parse(saved) : null;
  });

  const updateConfig = (newConfig: AirtableConfig) => {
    setConfig(newConfig);
    localStorage.setItem('airtable-config', JSON.stringify(newConfig));
  };

  const clearConfig = () => {
    setConfig(null);
    localStorage.removeItem('airtable-config');
  };

  return { config, updateConfig, clearConfig };
};

export const useAirtableData = (tableName: string) => {
  const { config } = useAirtableConfig();

  return useQuery({
    queryKey: ['airtable', tableName, config?.apiKey],
    queryFn: async () => {
      if (!config) throw new Error('Configuration Airtable manquante');
      return airtableService.fetchRecords({ ...config, tableName });
    },
    enabled: !!config,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useClients = () => {
  const { data, isLoading, error } = useAirtableData('Client DB');
  
  const clients: Client[] = data?.records.map(record => ({
    id: record.id,
    nom: record.fields.Nom || record.fields.nom || '',
    prenom: record.fields.Prenom || record.fields.prenom || '',
    email: record.fields.Email || record.fields.email || '',
    telephone: record.fields.Telephone || record.fields.telephone,
    adresse: record.fields.Adresse || record.fields.adresse,
    dateNaissance: record.fields['Date de naissance'] || record.fields.dateNaissance,
    preferences: record.fields.Preferences || record.fields.preferences,
    createdTime: record.createdTime
  })) || [];

  return { clients, isLoading, error };
};

export const usePlats = () => {
  const { data, isLoading, error } = useAirtableData('Plats DB');
  
  const plats: Plat[] = data?.records.map(record => ({
    id: record.id,
    nom: record.fields.Nom || record.fields.nom || '',
    description: record.fields.Description || record.fields.description,
    prix: parseFloat(record.fields.Prix || record.fields.prix || 0),
    categorie: record.fields.Categorie || record.fields.categorie,
    ingredients: record.fields.Ingredients || record.fields.ingredients,
    disponible: record.fields.Disponible !== false && record.fields.disponible !== false,
    image: record.fields.Image || record.fields.image,
    allergenes: record.fields.Allergenes || record.fields.allergenes,
    // Disponibilité par jour selon le cahier des charges
    lundi_dispo: record.fields.lundi_dispo || record.fields['Lundi Dispo'] || 'non',
    mardi_dispo: record.fields.mardi_dispo || record.fields['Mardi Dispo'] || 'non',
    mercredi_dispo: record.fields.mercredi_dispo || record.fields['Mercredi Dispo'] || 'non',
    jeudi_dispo: record.fields.jeudi_dispo || record.fields['Jeudi Dispo'] || 'non',
    vendredi_dispo: record.fields.vendredi_dispo || record.fields['Vendredi Dispo'] || 'non',
    samedi_dispo: record.fields.samedi_dispo || record.fields['Samedi Dispo'] || 'non',
    dimanche_dispo: record.fields.dimanche_dispo || record.fields['Dimanche Dispo'] || 'non',
    createdTime: record.createdTime
  })) || [];

  return { plats, isLoading, error };
};

export const useCreateClient = () => {
  const { config } = useAirtableConfig();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientData: Partial<Client>) => {
      if (!config) throw new Error('Configuration Airtable manquante');
      
      const fields = {
        Nom: clientData.nom,
        Prenom: clientData.prenom,
        Email: clientData.email,
        Telephone: clientData.telephone,
        Adresse: clientData.adresse,
        'Date de naissance': clientData.dateNaissance,
        Preferences: clientData.preferences
      };

      return airtableService.createRecord({ ...config, tableName: 'Client DB' }, fields);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['airtable', 'Client DB'] });
    }
  });
};

export const useCreateCommande = () => {
  const { config } = useAirtableConfig();

  return useMutation({
    mutationFn: async (commandeData: any) => {
      if (!config) throw new Error('Configuration Airtable manquante');
      
      const fields = {
        'Client Email': commandeData.clientEmail,
        'Plats': JSON.stringify(commandeData.panier),
        'Total': parseFloat(commandeData.total),
        'Date Retrait': commandeData.dateRetrait,
        'Heure Retrait': commandeData.heureRetrait,
        'Demandes Speciales': commandeData.demandesSpeciales,
        'Statut': 'En Attente de Confirmation',
        'Date Commande': new Date().toISOString()
      };

      return airtableService.createRecord({ ...config, tableName: 'Commandes' }, fields);
    }
  });
};

export const useCreateDemandeTraiteur = () => {
  const { config } = useAirtableConfig();

  return useMutation({
    mutationFn: async (demandeData: any) => {
      if (!config) throw new Error('Configuration Airtable manquante');
      
      const fields = {
        'Nom Evenement': demandeData.nomEvenement,
        'Type Evenement': demandeData.typeEvenement,
        'Date Evenement': demandeData.dateEvenement,
        'Nombre Personnes': parseInt(demandeData.nombrePersonnes),
        'Budget': demandeData.budgetClient,
        'Plats Selectionnes': JSON.stringify(demandeData.platsSelectionnes),
        'Demandes Speciales': demandeData.demandesSpeciales,
        'Statut': 'Nouvelle',
        'Date Demande': new Date().toISOString()
      };

      return airtableService.createRecord({ ...config, tableName: 'Demandes Traiteur' }, fields);
    }
  });
};
