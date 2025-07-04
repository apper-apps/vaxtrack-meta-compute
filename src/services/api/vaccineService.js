import { toast } from 'react-toastify';

const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const vaccineService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "vaccine_id" } },
          { field: { Name: "commercial_name" } },
          { field: { Name: "generic_name" } },
          { field: { Name: "lot_number" } },
          { field: { Name: "quantity" } },
          { field: { Name: "quantity_on_hand" } },
          { field: { Name: "expiration_date" } },
          { field: { Name: "received_date" } }
        ],
        orderBy: [
          { fieldName: "expiration_date", sorttype: "ASC" }
        ]
      };
      
      const response = await apperClient.fetchRecords('vaccine', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching vaccines:", error);
      toast.error("Failed to load vaccines");
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "vaccine_id" } },
          { field: { Name: "commercial_name" } },
          { field: { Name: "generic_name" } },
          { field: { Name: "lot_number" } },
          { field: { Name: "quantity" } },
          { field: { Name: "quantity_on_hand" } },
          { field: { Name: "expiration_date" } },
          { field: { Name: "received_date" } }
        ]
      };
      
      const response = await apperClient.getRecordById('vaccine', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching vaccine with ID ${id}:`, error);
      return null;
    }
  },

  async create(vaccineData) {
    try {
      const params = {
        records: [{
          Name: vaccineData.Name || vaccineData.commercial_name,
          vaccine_id: vaccineData.vaccine_id,
          commercial_name: vaccineData.commercial_name,
          generic_name: vaccineData.generic_name,
          lot_number: vaccineData.lot_number,
          quantity: vaccineData.quantity,
          quantity_on_hand: vaccineData.quantity_on_hand,
          expiration_date: vaccineData.expiration_date,
          received_date: vaccineData.received_date
        }]
      };
      
      const response = await apperClient.createRecord('vaccine', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to create vaccine record');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        return successfulRecord?.data;
      }
      
      throw new Error('No response data received');
    } catch (error) {
      console.error("Error creating vaccine:", error);
      throw error;
    }
  },

  async update(id, vaccineData) {
    try {
      const updateData = {};
      
      // Only include updateable fields
      if (vaccineData.Name !== undefined) updateData.Name = vaccineData.Name;
      if (vaccineData.vaccine_id !== undefined) updateData.vaccine_id = vaccineData.vaccine_id;
      if (vaccineData.commercial_name !== undefined) updateData.commercial_name = vaccineData.commercial_name;
      if (vaccineData.generic_name !== undefined) updateData.generic_name = vaccineData.generic_name;
      if (vaccineData.lot_number !== undefined) updateData.lot_number = vaccineData.lot_number;
      if (vaccineData.quantity !== undefined) updateData.quantity = vaccineData.quantity;
      if (vaccineData.quantity_on_hand !== undefined) updateData.quantity_on_hand = vaccineData.quantity_on_hand;
      if (vaccineData.expiration_date !== undefined) updateData.expiration_date = vaccineData.expiration_date;
      if (vaccineData.received_date !== undefined) updateData.received_date = vaccineData.received_date;
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...updateData
        }]
      };
      
      const response = await apperClient.updateRecord('vaccine', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to update vaccine record');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        return successfulRecord?.data;
      }
      
      throw new Error('No response data received');
    } catch (error) {
      console.error("Error updating vaccine:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('vaccine', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting vaccine:", error);
      return false;
    }
  },

  async getExpiringVaccines(daysThreshold = 30) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "vaccine_id" } },
          { field: { Name: "commercial_name" } },
          { field: { Name: "generic_name" } },
          { field: { Name: "lot_number" } },
          { field: { Name: "quantity_on_hand" } },
          { field: { Name: "expiration_date" } }
        ],
        where: [
          {
            FieldName: "expiration_date",
            Operator: "RelativeMatch",
            Values: [`next ${daysThreshold} days`]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('vaccine', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching expiring vaccines:", error);
      return [];
    }
  },

  async getExpiredVaccines() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "vaccine_id" } },
          { field: { Name: "commercial_name" } },
          { field: { Name: "generic_name" } },
          { field: { Name: "lot_number" } },
          { field: { Name: "quantity_on_hand" } },
          { field: { Name: "expiration_date" } }
        ],
        where: [
          {
            FieldName: "expiration_date",
            Operator: "LessThan",
            Values: [new Date().toISOString().split('T')[0]]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('vaccine', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching expired vaccines:", error);
      return [];
    }
  },

  async getLowStockVaccines(threshold = 5) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "vaccine_id" } },
          { field: { Name: "commercial_name" } },
          { field: { Name: "generic_name" } },
          { field: { Name: "lot_number" } },
          { field: { Name: "quantity_on_hand" } },
          { field: { Name: "expiration_date" } }
        ],
        whereGroups: [{
          operator: "AND",
          subGroups: [{
            operator: "AND",
            conditions: [
              {
                fieldName: "quantity_on_hand",
                operator: "GreaterThan",
                values: ["0"]
              },
              {
                fieldName: "quantity_on_hand",
                operator: "LessThanOrEqualTo",
                values: [threshold.toString()]
              }
            ]
          }]
        }]
      };
      
      const response = await apperClient.fetchRecords('vaccine', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching low stock vaccines:", error);
      return [];
    }
  }
};