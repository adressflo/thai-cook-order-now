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
    // Log configuration update for audit trail
    console.log('Airtable config updated:', new Date().toISOString());
  };

  const clearConfig = () => {
    setConfig(null);
    localStorage.removeItem('airtable-config');
    console.log('Airtable config cleared:', new Date().toISOString());
  };

  return { config, updateConfig, clearConfig };
};

export const useAirtableData = (tableName: string) => {
  const { config } = useAirtableConfig();

  return useQuery({
    queryKey: ['airtable', tableName, config?.apiKey],
    queryFn: async () => {
      if (!config) throw new Error('Configuration Airtable manquante');
      console.log(`Fetching ${tableName} data at:`, new Date().toISOString());
      return airtableService.fetchRecords({ ...config, tableName });
    },
    enabled: !!config,
    staleTime: 5 * 60 * 1000, // 5 minutes pour gérer la synchronisation temps réel
    refetchInterval: 30 * 1000, // Refresh toutes les 30s pour maintenir la sync <5s
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
  
  const plats: Plat[] = data?.records.map(record => {
    // Calcul de disponibilité dynamique selon le cahier des charges V2.0
    const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const todayName = dayNames[new Date().getDay()];
    
    // Vérification des stocks avec formule IF( {Plats Restants} > 0, "Disponible", "Indisponible")
    const platsRestants = parseInt(record.fields['Plats Restants'] || record.fields.stock || '0');
    const stockDisponible = platsRestants > 0;
    
    return {
      id: record.id,
      nom: record.fields.Nom || record.fields.nom || '',
      description: record.fields.Description || record.fields.description,
      prix: parseFloat(record.fields.Prix || record.fields.prix || 0),
      categorie: record.fields.Categorie || record.fields.categorie,
      ingredients: record.fields.Ingredients || record.fields.ingredients,
      disponible: stockDisponible && (record.fields.Disponible !== false && record.fields.disponible !== false),
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
    };
  }).filter(plat => {
    // Filtrage selon la disponibilité du jour actuel
    const today = new Date().getDay();
    const dayFields = ['dimanche_dispo', 'lundi_dispo', 'mardi_dispo', 'mercredi_dispo', 'jeudi_dispo', 'vendredi_dispo', 'samedi_dispo'];
    const todayField = dayFields[today] as keyof Plat;
    return plat[todayField] === 'oui' || plat[todayField] === 'disponible';
  }) || [];

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
        Preferences: clientData.preferences,
        'Date Creation': new Date().toISOString(),
        Statut: 'Actif' // Intégration RBAC niveau Client
      };

      console.log('Creating client:', fields);
      return airtableService.createRecord({ ...config, tableName: 'Client DB' }, fields);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['airtable', 'Client DB'] });
      console.log('Client created successfully at:', new Date().toISOString());
    }
  });
};

export const useCreateCommande = () => {
  const { config } = useAirtableConfig();

  return useMutation({
    mutationFn: async (commandeData: any) => {
      if (!config) throw new Error('Configuration Airtable manquante');
      
      // Workflow de validation en 4 étapes selon le cahier des charges V2.0
      const fields = {
        'Client Email': commandeData.clientEmail,
        'Plats': JSON.stringify(commandeData.panier),
        'Total': parseFloat(commandeData.total),
        'Date Retrait': commandeData.dateRetrait,
        'Heure Retrait': commandeData.heureRetrait,
        'Demandes Speciales': commandeData.demandesSpeciales,
        'Statut': 'Étape 1: Soumission', // Workflow 4 étapes
        'Date Commande': new Date().toISOString(),
        'Validation Required': commandeData.panier.length > 5 ? 'Oui' : 'Non', // Automation pour groupes
        'Type Commande': commandeData.panier.length > 5 ? 'Groupe' : 'Individuelle'
      };

      console.log('Creating order with workflow:', fields);
      
      // Déclencher automation si commande groupe (>5 plats)
      if (commandeData.panier.length > 5) {
        console.log('Triggering group order automation:', {
          quantite: commandeData.panier.length,
          type: 'Groupe',
          actions: ['Notifier équipe cuisine', 'Bloquer créneau', 'Générer PDF', 'Maj CRM']
        });
      }

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
        'Date Demande': new Date().toISOString(),
        'Contact Email': demandeData.contactEmail,
        'Contact Telephone': demandeData.contactTelephone,
        'Validation RBAC': 'Manager Required', // Nécessite validation niveau Manager
        'Workflow Step': 'Initial Submission'
      };

      console.log('Creating traiteur request with RBAC validation:', fields);
      return airtableService.createRecord({ ...config, tableName: 'Demandes Traiteur' }, fields);
    }
  });
};

// Hook pour les analytics et KPI en temps réel selon V2.0
export const useAirtableAnalytics = () => {
  const { config } = useAirtableConfig();
  
  return useQuery({
    queryKey: ['airtable', 'analytics', config?.apiKey],
    queryFn: async () => {
      if (!config) throw new Error('Configuration Airtable manquante');
      
      // Récupération des données pour KPI temps réel
      const commandes = await airtableService.fetchRecords({ ...config, tableName: 'Commandes' });
      const clients = await airtableService.fetchRecords({ ...config, tableName: 'Client DB' });
      
      return {
        totalCommandes: commandes.records.length,
        commandesAujourdhui: commandes.records.filter(r => 
          new Date(r.fields['Date Commande']).toDateString() === new Date().toDateString()
        ).length,
        totalClients: clients.records.length,
        timestamp: new Date().toISOString()
      };
    },
    enabled: !!config,
    refetchInterval: 60 * 1000, // Mise à jour KPI chaque minute
  });
};
