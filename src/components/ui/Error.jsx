import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ 
  message = 'Something went wrong. Please try again.',
  onRetry,
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
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center">
            <ApperIcon name="AlertTriangle" size={32} className="text-error" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {message}
            </p>
          </div>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="primary"
              icon="RefreshCw"
            >
              Try Again
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default Error;