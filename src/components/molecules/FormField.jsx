import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';

const FormField = ({
  type = 'input',
  label,
  id,
  error,
  required = false,
  className = '',
  ...props
}) => {
  const Component = type === 'select' ? Select : Input;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      <Component
        id={id}
        error={error}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default FormField;