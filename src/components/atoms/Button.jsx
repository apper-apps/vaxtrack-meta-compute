import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 focus:ring-primary shadow-lg hover:shadow-xl',
    secondary: 'bg-white text-primary border border-primary hover:bg-primary hover:text-white focus:ring-primary shadow-md hover:shadow-lg',
    accent: 'bg-gradient-to-r from-accent to-orange-500 text-white hover:from-accent/90 hover:to-orange-500/90 focus:ring-accent shadow-lg hover:shadow-xl',
    success: 'bg-gradient-to-r from-success to-green-600 text-white hover:from-success/90 hover:to-green-600/90 focus:ring-success shadow-lg hover:shadow-xl',
    warning: 'bg-gradient-to-r from-warning to-yellow-600 text-white hover:from-warning/90 hover:to-yellow-600/90 focus:ring-warning shadow-lg hover:shadow-xl',
    error: 'bg-gradient-to-r from-error to-red-700 text-white hover:from-error/90 hover:to-red-700/90 focus:ring-error shadow-lg hover:shadow-xl',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    link: 'text-primary hover:text-primary/80 hover:underline focus:ring-primary'
  };

  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  const iconSizes = {
    small: 16,
    medium: 20,
    large: 24
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {loading && (
        <ApperIcon
          name="Loader2"
          size={iconSizes[size]}
          className="animate-spin mr-2"
        />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon
          name={icon}
          size={iconSizes[size]}
          className="mr-2"
        />
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon
          name={icon}
          size={iconSizes[size]}
          className="ml-2"
        />
      )}
    </motion.button>
  );
};

export default Button;