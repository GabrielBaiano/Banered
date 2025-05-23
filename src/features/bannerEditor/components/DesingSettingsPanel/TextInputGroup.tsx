import React from 'react';

interface TextInputGroupProps {
  label: string;
  idSuffix: string;
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  type?: string; // para permitir 'text', 'number', etc.
}

const TextInputGroup: React.FC<TextInputGroupProps> = ({
  label,
  idSuffix,
  value,
  onChange,
  placeholder = '',
  type = 'text',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="setting-group">
      <label htmlFor={`textinput-${idSuffix}`}>{label}:</label>
      <input
        type={type}
        id={`textinput-${idSuffix}`}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        style={{ width: '100%', boxSizing: 'border-box' }} // Exemplo
      />
    </div>
  );
};

export default TextInputGroup;