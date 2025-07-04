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
    vaccine_id: '',
    commercial_name: '',
    generic_name: '',
    lot_number: '',
    expiration_date: '',
    quantity_sent: '',
    quantity_received: '',
    doses_passed_inspection: '',
    doses_failed_inspection: '',
    discrepancy_reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

// Auto-calculate doses passed inspection
    if (field === 'quantity_received' || field === 'doses_failed_inspection') {
      const received = field === 'quantity_received' ? parseInt(value) || 0 : parseInt(formData.quantity_received) || 0;
      const failed = field === 'doses_failed_inspection' ? parseInt(value) || 0 : parseInt(formData.doses_failed_inspection) || 0;
      const passed = Math.max(0, received - failed);
      
      setFormData(prev => ({
        ...prev,
        doses_passed_inspection: passed.toString()
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
if (!formData.vaccine_id || !formData.commercial_name || !formData.generic_name || !formData.lot_number || !formData.expiration_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

// Create or update vaccine record
      const vaccineData = {
        vaccine_id: formData.vaccine_id,
        commercial_name: formData.commercial_name,
        generic_name: formData.generic_name,
        lot_number: formData.lot_number,
        quantity: parseInt(formData.quantity_received) || 0,
        quantity_on_hand: parseInt(formData.doses_passed_inspection) || 0,
        expiration_date: formData.expiration_date,
        received_date: new Date().toISOString().split('T')[0]
      };

      await vaccineService.create(vaccineData);

      // Create receipt record
      const receiptData = {
        vaccine_id: formData.vaccine_id,
        received_date: new Date().toISOString().split('T')[0],
        quantity_sent: parseInt(formData.quantity_sent) || 0,
        quantity_received: parseInt(formData.quantity_received) || 0,
        doses_passed_inspection: parseInt(formData.doses_passed_inspection) || 0,
        doses_failed_inspection: parseInt(formData.doses_failed_inspection) || 0,
        discrepancy_reason: formData.discrepancy_reason
      };

      await receiptService.create(receiptData);

      toast.success('Vaccine shipment received successfully');
      
// Reset form
      setFormData({
        vaccine_id: '',
        commercial_name: '',
        generic_name: '',
        lot_number: '',
        expiration_date: '',
        quantity_sent: '',
        quantity_received: '',
        doses_passed_inspection: '',
        doses_failed_inspection: '',
        discrepancy_reason: ''
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
                  id="vaccine_id"
                  value={formData.vaccine_id}
                  onChange={(e) => handleInputChange('vaccine_id', e.target.value)}
                  placeholder="e.g., PSWH01"
                  required
                />
                
<FormField
                  label="Commercial Name"
                  id="commercial_name"
                  value={formData.commercial_name}
                  onChange={(e) => handleInputChange('commercial_name', e.target.value)}
                  placeholder="e.g., Daptacel SDV"
                  required
                />
                
<FormField
                  label="Generic Name"
                  id="generic_name"
                  value={formData.generic_name}
                  onChange={(e) => handleInputChange('generic_name', e.target.value)}
                  placeholder="e.g., DTaP"
                  required
                />
                
<FormField
                  label="Lot Number"
                  id="lot_number"
                  value={formData.lot_number}
                  onChange={(e) => handleInputChange('lot_number', e.target.value)}
                  placeholder="e.g., 3CA03C3"
                  required
                />
                
<FormField
                  label="Expiration Date"
                  id="expiration_date"
                  type="date"
                  value={formData.expiration_date}
                  onChange={(e) => handleInputChange('expiration_date', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Shipment Details</h3>
                
<FormField
                  label="Quantity Sent"
                  id="quantity_sent"
                  type="number"
                  min="0"
                  value={formData.quantity_sent}
                  onChange={(e) => handleInputChange('quantity_sent', e.target.value)}
                  placeholder="0"
                />
                
<FormField
                  label="Quantity Received"
                  id="quantity_received"
                  type="number"
                  min="0"
                  value={formData.quantity_received}
                  onChange={(e) => handleInputChange('quantity_received', e.target.value)}
                  placeholder="0"
                />
                
<FormField
                  label="Doses Failed Inspection"
                  id="doses_failed_inspection"
                  type="number"
                  min="0"
                  value={formData.doses_failed_inspection}
                  onChange={(e) => handleInputChange('doses_failed_inspection', e.target.value)}
                  placeholder="0"
                />
                
<FormField
                  label="Doses Passed Inspection"
                  id="doses_passed_inspection"
                  type="number"
                  min="0"
                  value={formData.doses_passed_inspection}
                  disabled
                  placeholder="Calculated automatically"
                />
                
<FormField
                  label="Discrepancy Reason"
                  id="discrepancy_reason"
                  value={formData.discrepancy_reason}
                  onChange={(e) => handleInputChange('discrepancy_reason', e.target.value)}
                  placeholder="Describe any discrepancies (optional)"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
onClick={() => setFormData({
                  vaccine_id: '',
                  commercial_name: '',
                  generic_name: '',
                  lot_number: '',
                  expiration_date: '',
                  quantity_sent: '',
                  quantity_received: '',
                  doses_passed_inspection: '',
                  doses_failed_inspection: '',
                  discrepancy_reason: ''
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