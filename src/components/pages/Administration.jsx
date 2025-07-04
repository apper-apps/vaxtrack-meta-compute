import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import VaccineTable from '@/components/organisms/VaccineTable';
import Card from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { vaccineService } from '@/services/api/vaccineService';
import { administrationService } from '@/services/api/administrationService';

const Administration = () => {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadVaccines = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const vaccineData = await vaccineService.getAll();
      setVaccines(vaccineData);
    } catch (err) {
      setError(err.message || 'Failed to load vaccines');
      toast.error('Failed to load vaccine data');
    } finally {
      setLoading(false);
    }
  };

const handleAdminister = async (vaccine, doses) => {
    try {
      const newQuantity = vaccine.quantity_on_hand - doses;
      
      // Update vaccine quantity
      await vaccineService.update(vaccine.Id, { quantity_on_hand: newQuantity });
      
      // Record administration
      await administrationService.create({
        vaccine_id: vaccine.vaccine_id,
        lot_number: vaccine.lot_number,
        doses_administered: doses,
        administration_date: new Date().toISOString().split('T')[0]
      });

      // Reload data
      await loadVaccines();
      
      toast.success(`Successfully administered ${doses} dose(s) of ${vaccine.commercial_name}`);
    } catch (err) {
      toast.error('Failed to record administration');
    }
  };

  useEffect(() => {
    loadVaccines();
  }, []);

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadVaccines} />;
  }

  if (vaccines.length === 0) {
    return (
      <Empty
        title="No vaccines available"
        description="There are no vaccines in your inventory to administer. Start by receiving vaccine shipments."
        icon="Syringe"
        actionLabel="Go to Receiving"
        onAction={() => window.location.href = '/receiving'}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Dose Administration
        </h2>
        <p className="text-gray-600">
          Record administered doses by entering the number of doses in the "Administer" column and clicking "Give". 
          The system will automatically update your inventory counts.
        </p>
      </Card>
      
      <VaccineTable
        vaccines={vaccines}
        onAdminister={handleAdminister}
        loading={loading}
      />
    </motion.div>
  );
};

export default Administration;