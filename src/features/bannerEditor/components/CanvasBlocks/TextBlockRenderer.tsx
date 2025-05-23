import React, { type DragEvent } from 'react';
import type { TextContentBlock } from '../../types/bannerContentTypes';
import { useBanner } from '../../contexts/BannerContext'; // Para fallback da fonte do banner

interface TextBlockRendererProps {
  block: TextContentBlock;
  onDragStart: (event: DragEvent<HTMLElement>, blockId: string) => void;
}

const TextBlockRenderer: React.FC<TextBlockRendererProps> = ({ block, onDragStart }) => {
  const { settings: bannerSettings } = useBanner(); // Pega as configurações globais do banner

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${block.x}px`,
    top: `${block.y}px`,
    fontSize: block.fontSize,
    color: block.color,
    fontWeight: block.fontWeight,
    fontStyle: block.fontStyle,
    textAlign: block.textAlign || 'left',
    fontFamily: block.fontFamily || bannerSettings.fontFamily, // Usa fonte do bloco ou fallback para a do banner
    lineHeight: block.lineHeight || 'normal', // Usa lineHeight do bloco ou fallback
    width: block.width || 'auto',
    height: block.height || 'auto',
    cursor: block.locked ? 'default' : 'grab',
    userSelect: 'none',
    border: block.locked ? 'none' : '1px dashed transparent', // Estilo via CSS com data-block-id
    padding: '2px',
    boxSizing: 'border-box',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  };

  const handleDragStartInternal = (event: DragEvent<HTMLElement>) => {
    if (block.locked) {
      event.preventDefault();
      return;
    }
    onDragStart(event, block.id);
    event.dataTransfer.setData("application/banner-block-move", block.id);
    event.dataTransfer.effectAllowed = "move";
  };

  const ElementTag = block.type === 'heading' ? 'h1' : block.type === 'list' ? 'ul' : 'div';

  if (block.type === 'list') {
    return (
      <ElementTag
        style={style}
        draggable={!block.locked}
        onDragStart={handleDragStartInternal}
        dangerouslySetInnerHTML={{ __html: block.htmlContent }}
        data-block-id={block.id}
      />
    );
  }

  return (
    <ElementTag
      style={style}
      draggable={!block.locked}
      onDragStart={handleDragStartInternal}
      dangerouslySetInnerHTML={{ __html: block.htmlContent }}
      data-block-id={block.id}
    />
  );
};

export default TextBlockRenderer;