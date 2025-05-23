import React, { useState } from 'react';
import Accordion from '../../../../components/Accordion/Accordion';
import AccordionItem from '../../../../components/Accordion/AccordionItem';
import DimensionInputGroup from './DimensionInputGroup'; // Importe este componente
import RangeInputGroup from './RangeInputGroup';
import FileInputGroup from './FileInputGroup';
import TextInputGroup from './TextInputGroup';
import { useBanner } from '../../contexts/BannerContext';

const DesignSettingsPanel: React.FC = () => {
  const { settings, updateSettings, applyGoogleFont } = useBanner();
  const [fontUrlInput, setFontUrlInput] = useState(settings.googleFontImportUrl);

  const handleBackgroundImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateSettings({ backgroundImage: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    } else {
      updateSettings({ backgroundImage: undefined });
    }
  };

  const handleApplyFontUrl = () => {
    applyGoogleFont(fontUrlInput);
  };

  return (
    <Accordion>
      <AccordionItem title="TAMANHO DO BANNER" initiallyOpen={true}>
        <DimensionInputGroup label="LARGURA (PX)" dimension="width" min={50} max={1400} />
        <DimensionInputGroup label="ALTURA (PX)" dimension="height" min={50} max={1400} />
      </AccordionItem>

      <AccordionItem title="BORDAS">
        <RangeInputGroup
            label="BORDA ARREDONDADA (PX)"
            idSuffix="borderRadius"
            value={settings.borderRadius}
            onChange={(newValue) => updateSettings({ borderRadius: newValue })}
            min={0}
            max={100} // Ou ajuste dinamicamente baseado no menor lado do banner
            unit="px"
        />
      </AccordionItem>

      <AccordionItem title="FUNDO (BACKGROUND)">
        <FileInputGroup
            label="FUNDO (IMAGEM/GIF):"
            idSuffix="backgroundImage"
            accept="image/*"
            onChange={handleBackgroundImageChange}
        />
        <RangeInputGroup
            label="POSIÇÃO X DO FUNDO (%):"
            idSuffix="bgPosX"
            value={settings.backgroundPositionX}
            onChange={(newValue) => updateSettings({ backgroundPositionX: newValue })}
            min={0}
            max={100}
            unit="%"
        />
        <RangeInputGroup
            label="POSIÇÃO Y DO FUNDO (%):"
            idSuffix="bgPosY"
            value={settings.backgroundPositionY}
            onChange={(newValue) => updateSettings({ backgroundPositionY: newValue })}
            min={0}
            max={100}
            unit="%"
        />
      </AccordionItem>

      <AccordionItem title="FONTES">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', marginBottom: '10px' }}>
          <div style={{ flexGrow: 1 }}>
            <TextInputGroup
              label="GOOGLE FONTS @IMPORT URL:"
              idSuffix="googleFontUrl"
              value={fontUrlInput}
              onChange={(newValue) => setFontUrlInput(newValue)}
              placeholder="Cole a URL do @import aqui"
            />
          </div>
          <button
            onClick={handleApplyFontUrl}
            style={{ padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', height: '38px', flexShrink: 0 }}
            title="Aplicar CSS da Fonte"
            className="button-apply-font"
          > Aplicar </button>
        </div>
        <TextInputGroup
          label="FONT FAMILY DO BANNER:"
          idSuffix="bannerFontFamily"
          value={settings.fontFamily}
          onChange={(newValue) => updateSettings({ fontFamily: newValue })}
          placeholder="Ex: 'Roboto', sans-serif"
        />
        <p style={{fontSize: '0.8em', color: 'rgba(255,255,255,0.7)', marginTop: '5px'}}>
            Nota: Após aplicar o CSS, digite o nome da família da fonte.
        </p>
      </AccordionItem>
    </Accordion>
  );
};

export default DesignSettingsPanel;