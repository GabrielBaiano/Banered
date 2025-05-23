import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectInputGroupProps {
  label: string;
  idSuffix: string;
  value: string;
  onChange: (newValue: string) => void;
  options: Option[];
}

const SelectInputGroup: React.FC<SelectInputGroupProps> = ({
  label,
  idSuffix,
  value,
  onChange,
  options,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="setting-group" style={{ marginBottom: '10px' }}> {/* Reutilizando classe ou crie uma nova */}
      <label htmlFor={`select-${idSuffix}`} style={{ display: 'block', marginBottom: '5px' }}>{label}:</label>
      <select
        id={`select-${idSuffix}`}
        value={value}
        onChange={handleChange}
        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInputGroup;