import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { vaccineService } from '@/services/api/vaccineService';
import { receiptService } from '@/services/api/receiptService';

const Receiving = () => {
  const [formData, setFormData] = useState({
    vaccineId: '',
    commercialName: '',
    genericName: '',
    lotNumber: '',
    expirationDate: '',
    quantitySent: '',
    quantityReceived: '',
    dosesPassedInspection: '',
    dosesFailedInspection: '',
    discrepancyReason: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-calculate doses passed inspection
    if (field === 'quantityReceived' || field === 'dosesFailedInspection') {
      const received = field === 'quantityReceived' ? parseInt(value) || 0 : parseInt(formData.quantityReceived) || 0;
      const failed = field === 'dosesFailedInspection' ? parseInt(value) || 0 : parseInt(formData.dosesFailedInspection) || 0;
      const passed = Math.max(0, received - failed);
      
      setFormData(prev => ({
        ...prev,
        dosesPassedInspection: passed.toString()
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.vaccineId || !formData.commercialName || !formData.genericName || !formData.lotNumber || !formData.expirationDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create or update vaccine record
      const vaccineData = {
        vaccineId: formData.vaccineId,
        commercialName: formData.commercialName,
        genericName: formData.genericName,
        lotNumber: formData.lotNumber,
        quantity: parseInt(formData.quantityReceived) || 0,
        quantityOnHand: parseInt(formData.dosesPassedInspection) || 0,
        expirationDate: formData.expirationDate,
        receivedDate: new Date().toISOString().split('T')[0]
      };

      await vaccineService.create(vaccineData);

      // Create receipt record
      const receiptData = {
        vaccineId: formData.vaccineId,
        receivedDate: new Date().toISOString().split('T')[0],
        quantitySent: parseInt(formData.quantitySent) || 0,
        quantityReceived: parseInt(formData.quantityReceived) || 0,
        dosesPassedInspection: parseInt(formData.dosesPassedInspection) || 0,
        dosesFailedInspection: parseInt(formData.dosesFailedInspection) || 0,
        discrepancyReason: formData.discrepancyReason
      };

      await receiptService.create(receiptData);

      toast.success('Vaccine shipment received successfully');
      
      // Reset form
      setFormData({
        vaccineId: '',
        commercialName: '',
        genericName: '',
        lotNumber: '',
        expirationDate: '',
        quantitySent: '',
        quantityReceived: '',
        dosesPassedInspection: '',
        dosesFailedInspection: '',
        discrepancyReason: ''
      });
      
    } catch (err) {
      setError(err.message || 'Failed to receive vaccine shipment');
      toast.error('Failed to receive vaccine shipment');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <Error message={error} onRetry={() => setError(null)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      <Card>
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Receive Vaccine Shipment</h2>
            <p className="text-gray-600 mt-2">
              Record details of incoming vaccine shipments and inspection results
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Vaccine Information</h3>
                
                <FormField
                  label="Vaccine ID"
                  id="vaccineId"
                  value={formData.vaccineId}
                  onChange={(e) => handleInputChange('vaccineId', e.target.value)}
                  placeholder="e.g., PSWH01"
                  required
                />
                
                <FormField
                  label="Commercial Name"
                  id="commercialName"
                  value={formData.commercialName}
                  onChange={(e) => handleInputChange('commercialName', e.target.value)}
                  placeholder="e.g., Daptacel SDV"
                  required
                />
                
                <FormField
                  label="Generic Name"
                  id="genericName"
                  value={formData.genericName}
                  onChange={(e) => handleInputChange('genericName', e.target.value)}
                  placeholder="e.g., DTaP"
                  required
                />
                
                <FormField
                  label="Lot Number"
                  id="lotNumber"
                  value={formData.lotNumber}
                  onChange={(e) => handleInputChange('lotNumber', e.target.value)}
                  placeholder="e.g., 3CA03C3"
                  required
                />
                
                <FormField
                  label="Expiration Date"
                  id="expirationDate"
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Shipment Details</h3>
                
                <FormField
                  label="Quantity Sent"
                  id="quantitySent"
                  type="number"
                  min="0"
                  value={formData.quantitySent}
                  onChange={(e) => handleInputChange('quantitySent', e.target.value)}
                  placeholder="0"
                />
                
                <FormField
                  label="Quantity Received"
                  id="quantityReceived"
                  type="number"
                  min="0"
                  value={formData.quantityReceived}
                  onChange={(e) => handleInputChange('quantityReceived', e.target.value)}
                  placeholder="0"
                />
                
                <FormField
                  label="Doses Failed Inspection"
                  id="dosesFailedInspection"
                  type="number"
                  min="0"
                  value={formData.dosesFailedInspection}
                  onChange={(e) => handleInputChange('dosesFailedInspection', e.target.value)}
                  placeholder="0"
                />
                
                <FormField
                  label="Doses Passed Inspection"
                  id="dosesPassedInspection"
                  type="number"
                  min="0"
                  value={formData.dosesPassedInspection}
                  disabled
                  placeholder="Calculated automatically"
                />
                
                <FormField
                  label="Discrepancy Reason"
                  id="discrepancyReason"
                  value={formData.discrepancyReason}
                  onChange={(e) => handleInputChange('discrepancyReason', e.target.value)}
                  placeholder="Describe any discrepancies (optional)"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setFormData({
                  vaccineId: '',
                  commercialName: '',
                  genericName: '',
                  lotNumber: '',
                  expirationDate: '',
                  quantitySent: '',
                  quantityReceived: '',
                  dosesPassedInspection: '',
                  dosesFailedInspection: '',
                  discrepancyReason: ''
                })}
              >
                Clear Form
              </Button>
              <Button
                type="submit"
                loading={loading}
                icon="Package"
              >
                Receive Shipment
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </motion.div>
  );
};

export default Receiving;