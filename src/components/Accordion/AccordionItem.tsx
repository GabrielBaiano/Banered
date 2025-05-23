import React, { useState, type ReactNode } from 'react';

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  initiallyOpen?: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, initiallyOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="accordion-item">
      <button
        className={`accordion-header ${isOpen ? 'active' : ''}`}
        onClick={toggleOpen}
        aria-expanded={isOpen}
      >
        {title}
      </button>

      <div className={`accordion-content ${isOpen ? 'active' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default AccordionItem;