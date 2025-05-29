
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { airtableService } from '@/services/airtableService';
import { AirtableConfig, Client, Plat, Commande, Evenement, PassageCommande } from '@/types/airtable';

export const useAirtableConfig = () => {
  const [config, setConfig] = useState<AirtableConfig | null>(() => {
    const saved = localStorage.getItem('airtable-config');
    return saved ? JSON.parse(saved) : null;
  });

  const updateConfig = (newConfig: AirtableConfig) => {
    setConfig(newConfig);
    localStorage.setItem('airtable-config', JSON.stringify(newConfig));
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refresh toutes les 30s pour sync temps réel
  });
};

// Hook pour Client DB selon la structure exacte
export const useClients = () => {
  const { data, isLoading, error } = useAirtableData('Client DB');
  
  const clients: Client[] = data?.records.map(record => ({
    id: record.id,
    client: record.fields.Client || '', // Champ formule
    nom: record.fields.Nom || '',
    prenom: record.fields.Prénom || record.fields.Prenom || '',
    preferenceClient: record.fields['Préférence client'],
    numeroTelephone: record.fields['Numéro de téléphone'],
    email: record.fields['e-mail'] || record.fields.email || '',
    adresseNumeroRue: record.fields['Adresse (numéro et rue)'],
    codePostal: record.fields['Code postal'],
    ville: record.fields.Ville,
    commentConnuChanthana: record.fields['Comment avez-vous connu ChanthanaThaiCook ?'],
    newsletterActualites: record.fields['Souhaitez-vous recevoir les actualités et offres par e-mail ?'],
    dateNaissance: record.fields['Date de naissance'],
    photoClient: record.fields['Photo Client'] ? record.fields['Photo Client'][0]?.url : undefined,
    commandesR: record.fields['Commandes R'],
    evenementsR: record.fields['Événements R'],
    createdTime: record.createdTime
  })) || [];

  return { clients, isLoading, error };
};

// Hook pour Plats DB selon la structure exacte
export const usePlats = () => {
  const { data, isLoading, error } = useAirtableData('Plats DB');
  
  const plats: Plat[] = data?.records.map(record => ({
    id: record.id,
    plat: record.fields.Plat || '', // Champ principal
    description: record.fields.Description,
    prix: parseFloat(record.fields.Prix || 0),
    prixVu: record.fields['Prix vu'], // Champ formule formaté
    // Disponibilité par jour selon structure exacte
    lundiDispo: record.fields.lundi_dispo as 'oui' | 'non',
    mardiDispo: record.fields.mardi_dispo as 'oui' | 'non',
    mercrediDispo: record.fields.mercredi_dispo as 'oui' | 'non',
    jeudiDispo: record.fields.jeudi_dispo as 'oui' | 'non',
    vendrediDispo: record.fields.vendredi_dispo as 'oui' | 'non',
    samediDispo: record.fields.samedi_dispo as 'oui' | 'non',
    dimancheDispo: record.fields.dimanche_dispo as 'oui' | 'non',
    scoreDisponibilite: record.fields['Score Disponibilité'],
    photoDuPlat: record.fields['Photo du Plat'] ? record.fields['Photo du Plat'][0]?.url : undefined,
    passageCommandeR: record.fields['passage commande R'],
    menusEvenementielsR: record.fields['Menus Événementiels R'],
    evenementsR: record.fields['Événements R'],
    createdTime: record.createdTime
  })) || [];

  // Filtrage dynamique selon le jour sélectionné
  const getPlatsDisponibles = (jour?: string) => {
    if (!jour) return plats;
    
    return plats.filter(plat => {
      const champDispo = `${jour}Dispo` as keyof Plat;
      return plat[champDispo] === 'oui';
    });
  };

  return { plats, getPlatsDisponibles, isLoading, error };
};

// Hook pour Commandes DB selon la structure exacte
export const useCommandes = () => {
  const { data, isLoading, error } = useAirtableData('Commandes DB');
  
  const commandes: Commande[] = data?.records.map(record => ({
    id: record.id,
    nCommande: record.fields['N commande'],
    compteurCommande: record.fields['compteur commande'],
    clientR: record.fields['Client R'] ? record.fields['Client R'][0] : undefined,
    dateHeureRetraitSouhaitees: record.fields['Date et Heure de Retrait Souhaitées'],
    datePriseCommande: record.fields['Date de Prise de Commande'],
    statutCommande: record.fields['Statut Commande'],
    passageCommandeR: record.fields['Passage Commande R'],
    demandeSpecialCommande: record.fields['Demande spécial pour la commande'],
    statutPaiement: record.fields['Statut Paiement'],
    totalCommande: record.fields['Total Commande'],
    totalCommandeVu: record.fields['Total Commande vu'],
    notesInternes: record.fields['Notes Internes'],
    createdTime: record.createdTime
  })) || [];

  return { commandes, isLoading, error };
};

// Hook pour Événements DB selon la structure exacte
export const useEvenements = () => {
  const { data, isLoading, error } = useAirtableData('Événements DB');
  
  const evenements: Evenement[] = data?.records.map(record => ({
    id: record.id,
    nEvenement: record.fields['N Événement'],
    idAutonumEvenement: record.fields['ID Autonum Événement'],
    nomEvenement: record.fields['Nom Événement'],
    contactClientR: record.fields['Contact Client R'] ? record.fields['Contact Client R'][0] : undefined,
    dateEvenement: record.fields['Date Événement'],
    typeEvenement: record.fields['Type d\'Événement'],
    nombrePersonnes: record.fields['Nombre de personnes'],
    budgetClient: record.fields['Budget Client'],
    demandesSpecialesEvenement: record.fields['Demandes Spéciales Événement'],
    platsPreSelectionnesR: record.fields['Plats Pré-sélectionnés (par client) R'],
    menuFinalConvenu: record.fields['Menu Final Convenu'],
    statutEvenement: record.fields['Statut Événement'],
    prixTotalDevise: record.fields['Prix Total Devisé'],
    lienDevisPDF: record.fields['Lien Devis PDF'],
    acompteDemande: record.fields['Acompte Demandé'],
    acompteRecu: record.fields['Acompte Reçu'],
    dateAcompteRecu: record.fields['Date Acompte Reçu'],
    statutAcompte: record.fields['Statut Acompte'],
    notesInternesEvenement: record.fields['Notes Internes Événement'],
    menuTypeSuggereR: record.fields['Menu Type Suggéré (interne) R'] ? record.fields['Menu Type Suggéré (interne) R'][0] : undefined,
    createdTime: record.createdTime
  })) || [];

  return { evenements, isLoading, error };
};

// Hook pour créer un client selon la structure exacte
export const useCreateClient = () => {
  const { config } = useAirtableConfig();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientData: Partial<Client>) => {
      if (!config) throw new Error('Configuration Airtable manquante');
      
      // Mappage exact vers les champs Airtable
      const fields = {
        'Nom': clientData.nom,
        'Prénom': clientData.prenom,
        'Préférence client': clientData.preferenceClient,
        'Numéro de téléphone': clientData.numeroTelephone,
        'e-mail': clientData.email,
        'Adresse (numéro et rue)': clientData.adresseNumeroRue,
        'Code postal': clientData.codePostal,
        'Ville': clientData.ville,
        'Comment avez-vous connu ChanthanaThaiCook ?': clientData.commentConnuChanthana,
        'Souhaitez-vous recevoir les actualités et offres par e-mail ?': clientData.newsletterActualites,
        'Date de naissance': clientData.dateNaissance
      };

      console.log('Creating client with exact Airtable structure:', fields);
      return airtableService.createRecord({ ...config, tableName: 'Client DB' }, fields);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['airtable', 'Client DB'] });
      console.log('Client created successfully at:', new Date().toISOString());
    }
  });
};

// Hook pour créer une commande selon la structure exacte
export const useCreateCommande = () => {
  const { config } = useAirtableConfig();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commandeData: {
      clientEmail: string;
      panier: Array<{ id: string; nom: string; prix: number; quantite: number }>;
      dateHeureRetrait: string;
      demandesSpeciales?: string;
    }) => {
      if (!config) throw new Error('Configuration Airtable manquante');
      
      // 1. Trouver le client par email
      const clientsData = await airtableService.fetchRecords({ ...config, tableName: 'Client DB' });
      const client = clientsData.records.find(record => 
        record.fields['e-mail'] === commandeData.clientEmail
      );
      
      if (!client) {
        throw new Error('Client non trouvé. Veuillez d\'abord créer votre profil.');
      }

      // 2. Créer la commande principale
      const commandeFields = {
        'Client R': [client.id],
        'Date et Heure de Retrait Souhaitées': commandeData.dateHeureRetrait,
        'Statut Commande': 'En attente de confirmation',
        'Demande spécial pour la commande': commandeData.demandesSpeciales,
        'Statut Paiement': 'En attente sur place'
      };

      console.log('Creating commande with exact structure:', commandeFields);
      const nouvelleCommande = await airtableService.createRecord(
        { ...config, tableName: 'Commandes DB' }, 
        commandeFields
      );

      // 3. Créer les lignes de passage commande
      for (const item of commandeData.panier) {
        const passageFields = {
          'Commande R': [nouvelleCommande.id],
          'Plat R': [item.id],
          'quantité plat commandé': item.quantite
        };

        await airtableService.createRecord(
          { ...config, tableName: 'Passage Commande DB' }, 
          passageFields
        );
      }

      return nouvelleCommande;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['airtable', 'Commandes DB'] });
      queryClient.invalidateQueries({ queryKey: ['airtable', 'Passage Commande DB'] });
      console.log('Commande created successfully with Passage Commande entries');
    }
  });
};

// Hook pour créer un événement selon la structure exacte
export const useCreateEvenement = () => {
  const { config } = useAirtableConfig();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (evenementData: {
      nomEvenement: string;
      contactEmail: string;
      dateEvenement: string;
      typeEvenement: string;
      nombrePersonnes: number;
      budgetClient?: number;
      demandesSpeciales?: string;
      platsPreSelectionnes?: string[];
    }) => {
      if (!config) throw new Error('Configuration Airtable manquante');
      
      // 1. Trouver le client par email
      const clientsData = await airtableService.fetchRecords({ ...config, tableName: 'Client DB' });
      const client = clientsData.records.find(record => 
        record.fields['e-mail'] === evenementData.contactEmail
      );
      
      if (!client) {
        throw new Error('Client non trouvé. Veuillez d\'abord créer votre profil.');
      }

      // 2. Créer l'événement
      const evenementFields = {
        'Nom Événement': evenementData.nomEvenement,
        'Contact Client R': [client.id],
        'Date Événement': evenementData.dateEvenement,
        'Type d\'Événement': evenementData.typeEvenement,
        'Nombre de personnes': evenementData.nombrePersonnes,
        'Budget Client': evenementData.budgetClient,
        'Demandes Spéciales Événement': evenementData.demandesSpeciales,
        'Plats Pré-sélectionnés (par client) R': evenementData.platsPreSelectionnes,
        'Statut Événement': 'Demande initiale',
        'Statut Acompte': 'Non applicable'
      };

      console.log('Creating événement with exact structure:', evenementFields);
      return airtableService.createRecord({ ...config, tableName: 'Événements DB' }, evenementFields);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['airtable', 'Événements DB'] });
      console.log('Événement created successfully');
    }
  });
};

// Hook pour les analytics selon les KPI du cahier des charges
export const useAirtableAnalytics = () => {
  const { config } = useAirtableConfig();
  
  return useQuery({
    queryKey: ['airtable', 'analytics', config?.apiKey],
    queryFn: async () => {
      if (!config) throw new Error('Configuration Airtable manquante');
      
      // Récupération parallèle des données pour analytics
      const [commandes, clients, evenements] = await Promise.all([
        airtableService.fetchRecords({ ...config, tableName: 'Commandes DB' }),
        airtableService.fetchRecords({ ...config, tableName: 'Client DB' }),
        airtableService.fetchRecords({ ...config, tableName: 'Événements DB' })
      ]);
      
      const aujourdhui = new Date().toDateString();
      const commandesAujourdhui = commandes.records.filter(r => 
        new Date(r.fields['Date de Prise de Commande']).toDateString() === aujourdhui
      ).length;

      // Calcul du CA du mois (basé sur les commandes "Payé sur place" ou "Payé intégralement")
      const debutMois = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const chiffreAffairesMois = commandes.records
        .filter(r => {
          const dateCommande = new Date(r.fields['Date de Prise de Commande']);
          return dateCommande >= debutMois && 
                 (r.fields['Statut Paiement'] === 'Payé sur place' || 
                  r.fields['Statut Paiement'] === 'Payé en ligne (futur)');
        })
        .reduce((total, r) => total + (r.fields['Total Commande'] || 0), 0);
      
      return {
        totalCommandes: commandes.records.length,
        commandesAujourdhui,
        totalClients: clients.records.length,
        totalEvenements: evenements.records.length,
        chiffreAffairesMois,
        timestamp: new Date().toISOString()
      };
    },
    enabled: !!config,
    refetchInterval: 60 * 1000, // Mise à jour analytics chaque minute
  });
};
