import React, { type ChangeEvent } from 'react'; // Adicione ChangeEvent
import { useBanner } from '../../contexts/BannerContext';
// import type { BannerSettings } from '../../contexts/BannerContext'; // Importe BannerSettings

interface DimensionInputGroupProps {
  label: string;
  dimension: 'width' | 'height';
  min?: number;
  max?: number; // Prop max para ser passada
}

const DimensionInputGroup: React.FC<DimensionInputGroupProps> = ({
  label,
  dimension,
  min = 1, // Default min
  max = 1400, // Default max, mas será sobrescrito pela prop
}) => {
  const { settings, updateSettings } = useBanner();
  // Assegura que o valor inicial respeite os limites min/max passados ou definidos
  const currentValue = Math.max(min, Math.min(settings[dimension], max));


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let numValue = parseInt(e.target.value, 10);

    // Validação e fixação aos limites
    if (isNaN(numValue)) {
        numValue = settings[dimension]; // Mantém o valor atual se a entrada for inválida
    } else {
        numValue = Math.max(min, Math.min(numValue, max));
    }
    updateSettings({ [dimension]: numValue });
  };

  return (
    <div className="setting-group">
      <label htmlFor={`${dimension}NumberReact`}>{label}:</label>
      <input
        type="number"
        id={`${dimension}NumberReact`}
        name={dimension} // Adiciona o nome para consistência
        value={currentValue} // Usa o valor já validado/fixado
        min={min}
        max={max} // Usa a prop max
        onChange={handleChange}
      />
      <input
        type="range"
        id={`${dimension}SliderReact`}
        name={`${dimension}Slider`} // Nome diferente para não conflitar se usarmos o mesmo handler
        value={currentValue}
        min={min}
        max={max} // Usa a prop max
        onChange={handleChange} // O mesmo handler pode funcionar se ele ler o valor do target
      />
      <span id={`${dimension}ValueReact`}>{currentValue}px</span>
    </div>
  );
};

export default DimensionInputGroup;