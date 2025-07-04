import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import VaccineTable from '@/components/organisms/VaccineTable';
import AlertSummary from '@/components/molecules/AlertSummary';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { vaccineService } from '@/services/api/vaccineService';
import { administrationService } from '@/services/api/administrationService';

const Dashboard = () => {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertCounts, setAlertCounts] = useState({
    expired: 0,
    expiring: 0,
    lowStock: 0
  });

  const loadVaccines = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [vaccineData, expired, expiring, lowStock] = await Promise.all([
        vaccineService.getAll(),
        vaccineService.getExpiredVaccines(),
        vaccineService.getExpiringVaccines(),
        vaccineService.getLowStockVaccines()
      ]);

      setVaccines(vaccineData);
      setAlertCounts({
        expired: expired.length,
        expiring: expiring.length,
        lowStock: lowStock.length
      });
    } catch (err) {
      setError(err.message || 'Failed to load vaccines');
      toast.error('Failed to load vaccine data');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminister = async (vaccine, doses) => {
    try {
      const newQuantity = vaccine.quantityOnHand - doses;
      
      // Update vaccine quantity
      await vaccineService.updateQuantityOnHand(vaccine.Id, newQuantity);
      
      // Record administration
      await administrationService.recordAdministration(
        vaccine.vaccineId,
        vaccine.lotNumber,
        doses
      );

      // Reload data
      await loadVaccines();
      
      toast.success(`Successfully administered ${doses} dose(s) of ${vaccine.commercialName}`);
    } catch (err) {
      toast.error('Failed to record administration');
    }
  };

  useEffect(() => {
    loadVaccines();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Loading type="cards" />
        <Loading type="table" />
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadVaccines} />;
  }

  if (vaccines.length === 0) {
    return (
      <Empty
        title="No vaccines in inventory"
        description="Start by receiving your first vaccine shipment to begin tracking your inventory."
        icon="Package"
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
      <AlertSummary
        expiredCount={alertCounts.expired}
        expiringCount={alertCounts.expiring}
        lowStockCount={alertCounts.lowStock}
      />
      
      <VaccineTable
        vaccines={vaccines}
        onAdminister={handleAdminister}
        loading={loading}
      />
    </motion.div>
  );
};

export default Dashboard;