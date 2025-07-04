import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { vaccineService } from '@/services/api/vaccineService';

const Reports = () => {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportType, setReportType] = useState('inventory');

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

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const headers = ['Vaccine ID', 'Commercial Name', 'Generic Name', 'Lot Number', 'Expiration Date', 'Quantity On Hand'];
    const csvContent = [
      headers.join(','),
      ...vaccines.map(vaccine => [
        vaccine.vaccineId,
        vaccine.commercialName,
        vaccine.genericName,
        vaccine.lotNumber,
        vaccine.expirationDate,
        vaccine.quantityOnHand
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vaccine-inventory-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Report exported successfully');
  };

  const getFilteredVaccines = () => {
    const today = new Date();
    
    switch (reportType) {
      case 'expired':
        return vaccines.filter(vaccine => new Date(vaccine.expirationDate) <= today);
      case 'expiring':
        const thirtyDaysFromNow = new Date(today);
        thirtyDaysFromNow.setDate(today.getDate() + 30);
        return vaccines.filter(vaccine => {
          const expDate = new Date(vaccine.expirationDate);
          return expDate > today && expDate <= thirtyDaysFromNow;
        });
      case 'lowStock':
        return vaccines.filter(vaccine => vaccine.quantityOnHand > 0 && vaccine.quantityOnHand <= 5);
      default:
        return vaccines;
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

  const filteredVaccines = getFilteredVaccines();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Inventory Reports
            </h2>
            <p className="text-gray-600 mt-2">
              Generate and export vaccine inventory reports
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              icon="Printer"
              onClick={handlePrint}
              className="no-print"
            >
              Print
            </Button>
            <Button
              variant="primary"
              icon="Download"
              onClick={handleExport}
              className="no-print"
            >
              Export CSV
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'inventory', label: 'All Inventory', icon: 'Package' },
            { key: 'expired', label: 'Expired', icon: 'AlertTriangle' },
            { key: 'expiring', label: 'Expiring Soon', icon: 'Clock' },
            { key: 'lowStock', label: 'Low Stock', icon: 'TrendingDown' }
          ].map((type) => (
            <Button
              key={type.key}
              variant={reportType === type.key ? 'primary' : 'ghost'}
              size="small"
              icon={type.icon}
              onClick={() => setReportType(type.key)}
            >
              {type.label}
            </Button>
          ))}
        </div>

        {filteredVaccines.length === 0 ? (
          <Empty
            title="No vaccines found"
            description={`No vaccines match the selected report criteria: ${reportType}.`}
            icon="FileText"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Vaccine ID
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Commercial Name
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Generic Name
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Lot Number
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Expiration Date
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Quantity On Hand
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredVaccines.map((vaccine) => (
                  <tr key={vaccine.Id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                      {vaccine.vaccineId}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                      {vaccine.commercialName}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                      {vaccine.genericName}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                      {vaccine.lotNumber}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                      {format(new Date(vaccine.expirationDate), 'MM/dd/yyyy')}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900 font-medium">
                      {vaccine.quantityOnHand}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-600">
          <div className="flex justify-between items-center">
            <span>
              Report generated on {format(new Date(), 'MMMM dd, yyyy')} at {format(new Date(), 'h:mm a')}
            </span>
            <span>
              Total records: {filteredVaccines.length}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default Reports;