import { useState, useEffect } from 'react';
import { vaccineService } from '@/services/api/vaccineService';

export const useVaccineAlerts = () => {
  const [alerts, setAlerts] = useState({
    expired: [],
    expiring: [],
    lowStock: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [expired, expiring, lowStock] = await Promise.all([
        vaccineService.getExpiredVaccines(),
        vaccineService.getExpiringVaccines(),
        vaccineService.getLowStockVaccines()
      ]);

      setAlerts({
        expired,
        expiring,
        lowStock
      });
    } catch (err) {
      setError(err.message || 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  return {
    alerts,
    loading,
    error,
    refreshAlerts: loadAlerts
  };
};