
import { AirtableConfig, AirtableResponse, AirtableRecord } from '@/types/airtable';

class AirtableService {
  private baseUrl = 'https://api.airtable.com/v0';

  async fetchRecords(config: AirtableConfig): Promise<AirtableResponse> {
    const { apiKey, baseId, tableName } = config;
    
    const response = await fetch(`${this.baseUrl}/${baseId}/${tableName}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur Airtable: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async createRecord(config: AirtableConfig, fields: Record<string, any>): Promise<AirtableRecord> {
    const { apiKey, baseId, tableName } = config;
    
    const response = await fetch(`${this.baseUrl}/${baseId}/${tableName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur Airtable: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  async updateRecord(config: AirtableConfig, recordId: string, fields: Record<string, any>): Promise<AirtableRecord> {
    const { apiKey, baseId, tableName } = config;
    
    const response = await fetch(`${this.baseUrl}/${baseId}/${tableName}/${recordId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur Airtable: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }
}

export const airtableService = new AirtableService();
