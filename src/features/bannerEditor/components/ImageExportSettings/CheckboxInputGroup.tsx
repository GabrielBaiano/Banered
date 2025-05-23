import React from 'react';

interface CheckboxInputGroupProps {
  label: string;
  idSuffix: string;
  checked: boolean;
  onChange: (isChecked: boolean) => void;
  disabled?: boolean;
}

const CheckboxInputGroup: React.FC<CheckboxInputGroupProps> = ({
  label,
  idSuffix,
  checked,
  onChange,
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className="setting-group" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <input
        type="checkbox"
        id={`checkbox-${idSuffix}`}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        style={{ marginRight: '8px' }}
      />
      <label htmlFor={`checkbox-${idSuffix}`} style={{ opacity: disabled ? 0.5 : 1 }}>{label}</label>
    </div>
  );
};

export default CheckboxInputGroup;