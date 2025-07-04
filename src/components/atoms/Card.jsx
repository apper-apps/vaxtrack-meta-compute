import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'normal',
  ...props
}) => {
  const baseClasses = 'bg-white rounded-xl border border-gray-200 shadow-md';
  
  const paddings = {
    none: '',
    small: 'p-4',
    normal: 'p-6',
    large: 'p-8'
  };

  const hoverClasses = hover ? 'hover:shadow-lg hover:border-gray-300' : '';

  const Component = hover ? motion.div : 'div';
  const motionProps = hover ? {
    whileHover: { y: -2 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <Component
      className={`${baseClasses} ${paddings[padding]} ${hoverClasses} ${className} transition-all duration-200`}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;