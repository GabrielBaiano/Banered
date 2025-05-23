import React, { useState } from 'react';
import Tabs from '../../../../components/Tabs/Tabs'; // Ajuste o caminho se necessário
import TabContentWrapper from '../../../../components/Tabs/TabContentWrapper'; // Ajuste o caminho
import AccordionItem from '../../../../components/Accordion/AccordionItem'; // Ajuste o caminho

import DesignSettingsPanel from '../DesingSettingsPanel/DesingSettingsPanel';
import HtmlContentPanel from '../HtmlContentPanel/HtmlContentPanel';
import HtmlBlocksPanel from '../HtmlBlockPanel/HtmlBlocksPanel';

import SelectInputGroup from '../ImageExportSettings/SelectInputGroup'; // Ajuste o caminho se necessário
import CheckboxInputGroup from '../ImageExportSettings/CheckboxInputGroup'; // Ajuste o caminho
import { useBanner } from '../../contexts/BannerContext'; // Ajuste o caminho se necessário
import type { ImageExportType } from '../../contexts/BannerContext'; // Ajuste o caminho se necessário

interface TabDefinitionForControlPanel { // Esta interface é local para este componente
    id: string;
    label: string;
}

const ControlPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('design');
  const {
    settings,
    setImageExportType,
    setTransparentBackground,
    triggerGenerateImage,
    triggerApplyChanges,
  } = useBanner();

  // Este array é constante e definido diretamente aqui.
  // É crucial que este nome (tabDefinitions) seja usado ao passar a prop para o componente <Tabs />
  const tabDefinitions: TabDefinitionForControlPanel[] = [
    { id: 'design', label: 'DESIGN' },
    { id: 'content', label: 'CONTEÚDO HTML' },
    { id: 'blocks', label: 'BLOCOS HTML' },
  ];

  const imageTypeOptions = [
    { value: 'png', label: 'PNG' },
    { value: 'jpeg', label: 'JPEG' },
    { value: 'webp', label: 'WEBP' },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const [applyButtonText, setApplyButtonText] = useState("APLICAR MUDANÇAS");

  const handleApplyChangesClick = () => {
    triggerApplyChanges();
    setApplyButtonText("ATUALIZADO!");
    setTimeout(() => {
        setApplyButtonText("APLICAR MUDANÇAS");
    }, 1500);
  };

  console.log("ControlPanel rendering. Passing to Tabs:", tabDefinitions); // Log para ver o que está sendo passado

  return (
    <div className="black-menu">
      <h2>CONFIGURAÇÕES DO BANNER</h2>
      <Tabs
        tabs={tabDefinitions} // A prop é nomeada 'tabs' e recebe 'tabDefinitions'
        activeTabId={activeTab}
        onTabChange={handleTabChange}
      />

      <TabContentWrapper id="design" isActive={activeTab === 'design'}><DesignSettingsPanel /></TabContentWrapper>
      <TabContentWrapper id="content" isActive={activeTab === 'content'}><HtmlContentPanel /></TabContentWrapper>
      <TabContentWrapper id="blocks" isActive={activeTab === 'blocks'}><HtmlBlocksPanel /></TabContentWrapper>

      <div style={{marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '15px'}}>
        <AccordionItem title="OPÇÕES DE EXPORTAÇÃO">
          <div className="export-settings-card-inner" style={{padding: '10px 0 5px 0'}}>
            <SelectInputGroup
                label="FORMATO DA IMAGEM:"
                idSuffix="imageExportTypeMenu"
                value={settings.imageExportType}
                onChange={(value) => setImageExportType(value as ImageExportType)}
                options={imageTypeOptions}
            />
            <CheckboxInputGroup
                label="FUNDO TRANSPARENTE (PNG)"
                idSuffix="transparentBgMenu"
                checked={settings.transparentBackground}
                onChange={setTransparentBackground}
                disabled={settings.imageExportType !== 'png'}
            />
          </div>
        </AccordionItem>
      </div>

      <div className="action-buttons-menu" style={{padding: '20px 0px 10px 0px', borderTop: '1px solid var(--border-color)', marginTop: '15px' }}>
        <button 
          className="button-secondary" 
          onClick={handleApplyChangesClick}
          style={{width: '100%', marginBottom: '10px'}}
        >
          {applyButtonText}
        </button>
        <button 
          className="button-primary" 
          onClick={triggerGenerateImage} 
          disabled={settings.isCapturing}
          style={{width: '100%'}}
        >
          {settings.isCapturing ? 'GERANDO...' : 'GERAR IMAGEM'}
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;