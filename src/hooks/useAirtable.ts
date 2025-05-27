
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
    nom: record.fields.Nom || '',
    prenom: record.fields.Prenom || '',
    email: record.fields.Email || '',
    telephone: record.fields.Telephone,
    adresse: record.fields.Adresse,
    dateNaissance: record.fields['Date de naissance'],
    preferences: record.fields.Preferences,
    createdTime: record.createdTime
  })) || [];

  return { clients, isLoading, error };
};

export const usePlats = () => {
  const { data, isLoading, error } = useAirtableData('Plats DB');
  
  const plats: Plat[] = data?.records.map(record => ({
    id: record.id,
    nom: record.fields.Nom || '',
    description: record.fields.Description,
    prix: record.fields.Prix,
    categorie: record.fields.Categorie,
    ingredients: record.fields.Ingredients,
    disponible: record.fields.Disponible !== false,
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
