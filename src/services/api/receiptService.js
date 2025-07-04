import { toast } from 'react-toastify';

const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const receiptService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "vaccine_id" } },
          { field: { Name: "received_date" } },
          { field: { Name: "quantity_sent" } },
          { field: { Name: "quantity_received" } },
          { field: { Name: "doses_passed_inspection" } },
          { field: { Name: "doses_failed_inspection" } },
          { field: { Name: "discrepancy_reason" } }
        ],
        orderBy: [
          { fieldName: "received_date", sorttype: "DESC" }
        ]
      };
      
      const response = await apperClient.fetchRecords('receipt', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching receipts:", error);
      toast.error("Failed to load receipts");
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "vaccine_id" } },
          { field: { Name: "received_date" } },
          { field: { Name: "quantity_sent" } },
          { field: { Name: "quantity_received" } },
          { field: { Name: "doses_passed_inspection" } },
          { field: { Name: "doses_failed_inspection" } },
          { field: { Name: "discrepancy_reason" } }
        ]
      };
      
      const response = await apperClient.getRecordById('receipt', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching receipt with ID ${id}:`, error);
      return null;
    }
  },

  async create(receiptData) {
    try {
      const params = {
        records: [{
          Name: receiptData.Name || `Receipt ${receiptData.vaccine_id}`,
          vaccine_id: receiptData.vaccine_id,
          received_date: receiptData.received_date,
          quantity_sent: receiptData.quantity_sent,
          quantity_received: receiptData.quantity_received,
          doses_passed_inspection: receiptData.doses_passed_inspection,
          doses_failed_inspection: receiptData.doses_failed_inspection,
          discrepancy_reason: receiptData.discrepancy_reason
        }]
      };
      
      const response = await apperClient.createRecord('receipt', params);
      
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
          throw new Error('Failed to create receipt record');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        return successfulRecord?.data;
      }
      
      throw new Error('No response data received');
    } catch (error) {
      console.error("Error creating receipt:", error);
      throw error;
    }
  },

  async update(id, receiptData) {
    try {
      const updateData = {};
      
      // Only include updateable fields
      if (receiptData.Name !== undefined) updateData.Name = receiptData.Name;
      if (receiptData.vaccine_id !== undefined) updateData.vaccine_id = receiptData.vaccine_id;
      if (receiptData.received_date !== undefined) updateData.received_date = receiptData.received_date;
      if (receiptData.quantity_sent !== undefined) updateData.quantity_sent = receiptData.quantity_sent;
      if (receiptData.quantity_received !== undefined) updateData.quantity_received = receiptData.quantity_received;
      if (receiptData.doses_passed_inspection !== undefined) updateData.doses_passed_inspection = receiptData.doses_passed_inspection;
      if (receiptData.doses_failed_inspection !== undefined) updateData.doses_failed_inspection = receiptData.doses_failed_inspection;
      if (receiptData.discrepancy_reason !== undefined) updateData.discrepancy_reason = receiptData.discrepancy_reason;
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...updateData
        }]
      };
      
      const response = await apperClient.updateRecord('receipt', params);
      
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
          throw new Error('Failed to update receipt record');
        }
        
        const successfulRecord = response.results.find(result => result.success);
        return successfulRecord?.data;
      }
      
      throw new Error('No response data received');
    } catch (error) {
      console.error("Error updating receipt:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('receipt', params);
      
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
      console.error("Error deleting receipt:", error);
      return false;
    }
  },

  async getByVaccineId(vaccineId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "vaccine_id" } },
          { field: { Name: "received_date" } },
          { field: { Name: "quantity_sent" } },
          { field: { Name: "quantity_received" } },
          { field: { Name: "doses_passed_inspection" } },
          { field: { Name: "doses_failed_inspection" } },
          { field: { Name: "discrepancy_reason" } }
        ],
        where: [
          {
            FieldName: "vaccine_id",
            Operator: "EqualTo",
            Values: [vaccineId]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('receipt', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching receipts for vaccine ${vaccineId}:`, error);
      return [];
    }
  }
};