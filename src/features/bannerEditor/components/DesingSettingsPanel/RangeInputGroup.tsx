import React from 'react';

interface RangeInputGroupProps {
  label: string;
  idSuffix: string; // Para garantir IDs únicos se usado múltiplas vezes
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  unit?: string; // Ex: "px", "%"
}

const RangeInputGroup: React.FC<RangeInputGroupProps> = ({
  label,
  idSuffix,
  value,
  onChange,
  min = 0,
  max = 100,
  unit = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value, 10));
  };

  return (
    <div className="setting-group">
      <label htmlFor={`range-${idSuffix}`}>{label}:</label>
      <input
        type="range"
        id={`range-${idSuffix}`}
        value={value}
        min={min}
        max={max}
        onChange={handleChange}
      />
      {/* O span para mostrar o valor pode ser ajustado conforme o span original */}
      {/* No seu HTML original o span tinha um ID específico. */}
      {/* Se precisar de um ID para o span, pode adicionar uma prop ou derivar de idSuffix. */}
      {/* Ex: <span id={`rangeValue-${idSuffix}`}>{value}{unit}</span> */}
      <span>{value}{unit}</span>
    </div>
  );
};

export default RangeInputGroup;