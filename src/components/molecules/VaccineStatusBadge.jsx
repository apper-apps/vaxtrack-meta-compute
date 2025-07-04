import { useMemo } from 'react';
import { differenceInDays } from 'date-fns';
import Badge from '@/components/atoms/Badge';

const VaccineStatusBadge = ({ expirationDate, quantityOnHand }) => {
  const status = useMemo(() => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const daysUntilExpiry = differenceInDays(expDate, today);

    if (daysUntilExpiry < 0) {
      return { type: 'expired', label: 'Expired' };
    } else if (daysUntilExpiry <= 30) {
      return { type: 'expiring', label: 'Expiring Soon' };
    } else if (quantityOnHand <= 5 && quantityOnHand > 0) {
      return { type: 'lowStock', label: 'Low Stock' };
    }
    return null;
  }, [expirationDate, quantityOnHand]);

  if (!status) return null;

  return (
    <Badge variant={status.type} size="small">
      {status.label}
    </Badge>
  );
};

export default VaccineStatusBadge;