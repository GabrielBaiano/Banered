import React from 'react';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      className={`tab-button ${isActive ? 'active' : ''}`}
      onClick={onClick}
      role="tab"
      aria-selected={isActive}
    >
      {label}
    </button>
  );
};

interface TabDefinition {
    id: string;
    label: string;
}

interface TabsProps {
  tabs: TabDefinition[] | undefined; // Permitir undefined para checagem
  activeTabId: string;
  onTabChange: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTabId, onTabChange }) => {
  // Log para verificar a prop recebida
  console.log("Tabs component props received - tabs:", tabs);

  // Verificação para garantir que 'tabs' é um array antes de usar .map()
  if (!tabs || !Array.isArray(tabs)) {
    console.error("Tabs component: 'tabs' prop is undefined or not an array.", tabs);
    // Você pode retornar null, um placeholder, ou um erro visual
    return <div className="tabs-nav-error">Erro: Definições de abas não carregadas.</div>;
  }

  if (tabs.length === 0) {
    // Opcional: Lidar com o caso de um array vazio, se isso não for esperado
    return <div className="tabs-nav">Nenhuma aba para exibir.</div>;
  }

  return (
    <div className="tabs-nav" role="tablist">
      {tabs.map((tab) => {
        // Log para cada tab individual, se necessário para depuração mais profunda
        // console.log("Mapping tab:", tab);
        if (!tab || typeof tab.id === 'undefined' || typeof tab.label === 'undefined') {
            console.error("Item de aba inválido:", tab);
            return null; // Pula a renderização de uma aba inválida
        }
        return (
            <TabButton
              key={tab.id}
              label={tab.label}
              isActive={tab.id === activeTabId}
              onClick={() => onTabChange(tab.id)}
            />
        );
      })}
    </div>
  );
};

export default Tabs;