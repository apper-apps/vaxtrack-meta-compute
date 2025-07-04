import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const AlertSummary = ({
  expiredCount = 0,
  expiringCount = 0,
  lowStockCount = 0,
  className = ''
}) => {
  const alerts = [
    {
      type: 'expired',
      count: expiredCount,
      label: 'Expired',
      icon: 'AlertTriangle',
      color: 'text-error',
      bgColor: 'bg-error/10'
    },
    {
      type: 'expiring',
      count: expiringCount,
      label: 'Expiring Soon',
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      type: 'lowStock',
      count: lowStockCount,
      label: 'Low Stock',
      icon: 'Package',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {alerts.map((alert, index) => (
        <motion.div
          key={alert.type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className={`${alert.bgColor} border-l-4 border-l-current ${alert.color}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${alert.bgColor} ${alert.color}`}>
                  <ApperIcon name={alert.icon} size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{alert.label}</p>
                  <p className={`text-2xl font-bold ${alert.color}`}>
                    {alert.count}
                  </p>
                </div>
              </div>
              {alert.count > 0 && (
                <Badge variant={alert.type} size="small">
                  {alert.count}
                </Badge>
              )}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default AlertSummary;