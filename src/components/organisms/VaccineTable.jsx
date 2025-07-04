import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import VaccineStatusBadge from '@/components/molecules/VaccineStatusBadge';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

const VaccineTable = ({ 
  vaccines = [], 
  onAdminister,
  loading = false,
  className = ''
}) => {
  const [sortField, setSortField] = useState('expirationDate');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [administeredDoses, setAdministeredDoses] = useState({});

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAdministeredChange = (vaccineId, value) => {
    setAdministeredDoses(prev => ({
      ...prev,
      [vaccineId]: value
    }));
  };

  const handleAdminister = (vaccine) => {
    const doses = parseInt(administeredDoses[vaccine.Id] || 0);
    if (doses > 0) {
      if (doses > vaccine.quantityOnHand) {
        toast.error('Cannot administer more doses than available');
        return;
      }
      onAdminister(vaccine, doses);
      setAdministeredDoses(prev => ({
        ...prev,
        [vaccine.Id]: 0
      }));
    }
  };

  const sortedAndFilteredVaccines = useMemo(() => {
    let filtered = vaccines.filter(vaccine => {
      const searchLower = searchTerm.toLowerCase();
      return (
        vaccine.commercialName.toLowerCase().includes(searchLower) ||
        vaccine.genericName.toLowerCase().includes(searchLower) ||
        vaccine.lotNumber.toLowerCase().includes(searchLower) ||
        vaccine.vaccineId.toLowerCase().includes(searchLower)
      );
    });

    return filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'expirationDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [vaccines, sortField, sortDirection, searchTerm]);

  const getRowClassName = (vaccine) => {
    const today = new Date();
    const expDate = new Date(vaccine.expirationDate);
    const daysUntilExpiry = differenceInDays(expDate, today);

    if (daysUntilExpiry < 0) {
      return 'table-row-expired';
    } else if (daysUntilExpiry <= 30) {
      return 'table-row-expiring';
    } else if (vaccine.quantityOnHand <= 5 && vaccine.quantityOnHand > 0) {
      return 'table-row-low-stock';
    }
    return 'hover:bg-gray-50';
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return 'ArrowUpDown';
    return sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Vaccine Inventory
          </h2>
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search vaccines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon="Search"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('vaccineId')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Vaccine ID
                  <ApperIcon name={getSortIcon('vaccineId')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('commercialName')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Commercial Name
                  <ApperIcon name={getSortIcon('commercialName')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('genericName')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Generic Name
                  <ApperIcon name={getSortIcon('genericName')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('lotNumber')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Lot Number
                  <ApperIcon name={getSortIcon('lotNumber')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('expirationDate')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Expiration Date
                  <ApperIcon name={getSortIcon('expirationDate')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('quantityOnHand')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Quantity on Hand
                  <ApperIcon name={getSortIcon('quantityOnHand')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Administer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {sortedAndFilteredVaccines.map((vaccine) => (
                <motion.tr
                  key={vaccine.Id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`transition-colors duration-200 ${getRowClassName(vaccine)}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {vaccine.vaccineId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vaccine.commercialName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vaccine.genericName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vaccine.lotNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(vaccine.expirationDate), 'MM/dd/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-medium">{vaccine.quantityOnHand}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max={vaccine.quantityOnHand}
                        value={administeredDoses[vaccine.Id] || ''}
                        onChange={(e) => handleAdministeredChange(vaccine.Id, e.target.value)}
                        className="w-20"
                        size="small"
                        disabled={vaccine.quantityOnHand === 0}
                      />
                      <Button
                        size="small"
                        variant="primary"
                        onClick={() => handleAdminister(vaccine)}
                        disabled={!administeredDoses[vaccine.Id] || vaccine.quantityOnHand === 0}
                      >
                        Give
                      </Button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <VaccineStatusBadge
                      expirationDate={vaccine.expirationDate}
                      quantityOnHand={vaccine.quantityOnHand}
                    />
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {sortedAndFilteredVaccines.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="Package" size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No vaccines found matching your search.</p>
        </div>
      )}
    </Card>
  );
};

export default VaccineTable;