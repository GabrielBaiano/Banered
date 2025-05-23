import React from 'react';
import type { DraggableBlockOptionData } from '../../types/bannerContentTypes';

interface DraggableBlockOptionProps {
  blockData: DraggableBlockOptionData;
}

const DraggableBlockOption: React.FC<DraggableBlockOptionProps> = ({ blockData }) => {
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    // O que vamos passar é a informação inicial para criar o bloco
    const dataToTransfer = {
      type: blockData.type,
      initialContent: blockData.initialContent,
      initialFontSize: blockData.initialFontSize,
      initialColor: blockData.initialColor,
      initialSrc: blockData.initialSrc,
      initialWidth: blockData.initialWidth,
      initialHeight: blockData.initialHeight,
    };
    event.dataTransfer.setData('application/json', JSON.stringify(dataToTransfer));
    event.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      className="draggable-block" // Classe do seu CSS original
      draggable="true"
      onDragStart={handleDragStart}
      title={`Arraste para adicionar ${blockData.label.toLowerCase()}`}
    >
      {blockData.label}
    </div>
  );
};

export default DraggableBlockOption;