import { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Select = forwardRef(({
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  disabled = false,
  size = 'medium',
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 appearance-none bg-white';
  
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-4 py-3 text-lg'
  };

  const errorClasses = error ? 'border-error focus:ring-error focus:border-error' : '';

  return (
    <div className="relative">
      <select
        ref={ref}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${baseClasses} ${sizes[size]} ${errorClasses} ${className} pr-10`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <ApperIcon
          name="ChevronDown"
          size={16}
          className="text-gray-400"
        />
      </div>
    </div>
  );
});

Select.displayName = 'Select';

export default Select;