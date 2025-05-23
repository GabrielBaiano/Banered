import React from 'react';

interface TextAreaInputGroupProps {
  label: string;
  idSuffix: string;
  value: string;
  onChange: (newValue: string) => void;
  rows?: number;
  placeholder?: string;
}

const TextAreaInputGroup: React.FC<TextAreaInputGroupProps> = ({
  label,
  idSuffix,
  value,
  onChange,
  rows = 3,
  placeholder = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="setting-group"> {/* Reutilizando a classe de estilo */}
      <label htmlFor={`textarea-${idSuffix}`}>{label}:</label>
      <textarea
        id={`textarea-${idSuffix}`}
        value={value}
        onChange={handleChange}
        rows={rows}
        placeholder={placeholder}
        // As classes CSS para textarea no seu style.css original
        // (.html-editor-group textarea) podem precisar ser generalizadas
        // ou você pode adicionar uma classe específica aqui se necessário.
        style={{ width: '100%', boxSizing: 'border-box' }} // Exemplo de estilo inline básico
      />
    </div>
  );
};

export default TextAreaInputGroup;