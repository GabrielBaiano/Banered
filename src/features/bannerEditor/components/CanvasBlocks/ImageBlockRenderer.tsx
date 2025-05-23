import React, { type DragEvent } from 'react';
import type { ImageContentBlock } from '../../types/bannerContentTypes';

interface ImageBlockRendererProps {
  block: ImageContentBlock;
  onDragStart: (event: DragEvent<HTMLDivElement>, blockId: string) => void;
}

const ImageBlockRenderer: React.FC<ImageBlockRendererProps> = ({ block, onDragStart }) => {
  const wrapperStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${block.x}px`,
    top: `${block.y}px`,
    width: typeof block.width === 'number' ? `${block.width}px` : block.width || 'auto',
    height: typeof block.height === 'number' ? `${block.height}px` : block.height || 'auto',
    cursor: block.locked ? 'default' : 'grab',
    userSelect: 'none',
    border: block.locked ? 'none' : '1px dashed transparent', // Borda virá do CSS via data-block-id
    boxSizing: 'border-box',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'block',
    pointerEvents: 'none',
  };

  const handleDragStartInternal = (event: DragEvent<HTMLDivElement>) => {
    if (block.locked) {
      event.preventDefault();
      return;
    }
    onDragStart(event, block.id);
    // Data transfer é setado no handleBlockDragStart do EditorPage
  };

  return (
    <div
      style={wrapperStyle}
      draggable={!block.locked}
      onDragStart={handleDragStartInternal}
      data-block-id={block.id} // Para o seletor CSS body.is-capturing
    >
      <img
        src={block.src}
        alt={block.alt || `Imagem ${block.id}`}
        style={imageStyle}
      />
    </div>
  );
};

export default ImageBlockRenderer;