import React, { type ReactNode } from 'react';

interface TabContentWrapperProps {
  id: string;
  isActive: boolean;
  children: ReactNode;
}

const TabContentWrapper: React.FC<TabContentWrapperProps> = ({ id, isActive, children }) => {
  if (!isActive) {
    return null; // <<< PONTO CHAVE: Não renderiza nada se não estiver ativo
  }

  // Se estiver ativo, renderiza o conteúdo.
  // A classe 'active' e 'tab-content' ainda podem ser usadas para estilização
  // adicional via CSS, mas a lógica de display primária é feita pelo React.
  return (
    <div id={`tab-${id}`} className="tab-content active">
      {children}
    </div>
  );
};

export default TabContentWrapper;