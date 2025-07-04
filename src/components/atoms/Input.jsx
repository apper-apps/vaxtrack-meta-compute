import { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = forwardRef(({
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  icon,
  iconPosition = 'left',
  size = 'medium',
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200';
  
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-4 py-3 text-lg'
  };

  const iconSizes = {
    small: 16,
    medium: 20,
    large: 24
  };

  const errorClasses = error ? 'border-error focus:ring-error focus:border-error' : '';

  if (icon) {
    return (
      <div className="relative">
        {iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon
              name={icon}
              size={iconSizes[size]}
              className="text-gray-400"
            />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseClasses} ${sizes[size]} ${errorClasses} ${
            iconPosition === 'left' ? 'pl-10' : iconPosition === 'right' ? 'pr-10' : ''
          } ${className}`}
          {...props}
        />
        {iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ApperIcon
              name={icon}
              size={iconSizes[size]}
              className="text-gray-400"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <input
      ref={ref}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`${baseClasses} ${sizes[size]} ${errorClasses} ${className}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;