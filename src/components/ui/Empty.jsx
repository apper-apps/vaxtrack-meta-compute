import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = 'No data available',
  description = 'There are no items to display at the moment.',
  icon = 'Package',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="text-center py-12">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <ApperIcon name={icon} size={32} className="text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {description}
            </p>
          </div>
          {actionLabel && onAction && (
            <Button
              onClick={onAction}
              variant="primary"
              icon="Plus"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default Empty;