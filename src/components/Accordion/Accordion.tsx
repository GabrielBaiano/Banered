import React, { ReactNode } from 'react';

interface AccordionProps {
  children: ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ children }) => {
  // Esta div pode não precisar de classe específica,
  // a menos que você tenha estilos para o container geral do acordeão.
  // Os itens individuais já usam "accordion-item".
  return <div>{children}</div>;
};

export default Accordion;