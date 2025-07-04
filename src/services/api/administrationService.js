import { toast } from 'react-toastify';

const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const administrationService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "vaccine_id" } },
          { field: { Name: "lot_number" } },
          { field: { Name: "doses_administered" } },
          { field: { Name: "administration_date" } }
        ],
        orderBy: [
          { fieldName: "administration_date", sorttype: "DESC" }
        ]
      };
      
      const response = await apperClient.fetchRecords('administration', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching administrations:", error);
      toast.error("Failed to load administrations");
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "vaccine_id" } },
          { field: { Name: "lot_number" } },
          { field: { Name: "doses_administered" } },
          { field: { Name: "administration_date" } }
        ]
      };
      
      const response = await apperClient.getRecordById('administration', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching administration with ID ${id}:`, error);
      return null;
    }
  },

  async create(adminData) {
    try {
      const params = {
        records: [{
          Name: adminData.Name || `Administration ${adminData.vaccine_id}`,
          vaccine_id: adminData.vaccine_id,
          lot_number: adminData.lot_number,
          doses_administered: adminData.doses_administered,
          administration_date: adminData.administration_date
        }]
      };
      
      const response = await apperClient.createRecord('administration', params);
      
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
          throw new Error('Failed to create administration record');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        return successfulRecord?.data;
      }
      
      throw new Error('No response data received');
    } catch (error) {
      console.error("Error creating administration:", error);
      throw error;
    }
  },

  async update(id, adminData) {
    try {
      const updateData = {};
      
      // Only include updateable fields
      if (adminData.Name !== undefined) updateData.Name = adminData.Name;
      if (adminData.vaccine_id !== undefined) updateData.vaccine_id = adminData.vaccine_id;
      if (adminData.lot_number !== undefined) updateData.lot_number = adminData.lot_number;
      if (adminData.doses_administered !== undefined) updateData.doses_administered = adminData.doses_administered;
      if (adminData.administration_date !== undefined) updateData.administration_date = adminData.administration_date;
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...updateData
        }]
      };
      
      const response = await apperClient.updateRecord('administration', params);
      
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
          throw new Error('Failed to update administration record');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        return successfulRecord?.data;
      }
      
      throw new Error('No response data received');
    } catch (error) {
      console.error("Error updating administration:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('administration', params);
      
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
      console.error("Error deleting administration:", error);
      return false;
    }
  },

  async getByVaccineId(vaccineId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "vaccine_id" } },
          { field: { Name: "lot_number" } },
          { field: { Name: "doses_administered" } },
          { field: { Name: "administration_date" } }
        ],
        where: [
          {
            FieldName: "vaccine_id",
            Operator: "EqualTo",
            Values: [vaccineId]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('administration', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching administrations for vaccine ${vaccineId}:`, error);
      return [];
    }
  }
};