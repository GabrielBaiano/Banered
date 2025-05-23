import React from 'react';
import DraggableBlockOption from './DraggableBlockOption';
import type { DraggableBlockOptionData } from '../../types/bannerContentTypes'; // Correção: Importar de bannerContentTypes
import { useBanner } from '../../contexts/BannerContext';
import AddedBlockItem from './AddedBlockItem'; // NOVO IMPORT

const availableBlocks: DraggableBlockOptionData[] = [
  {
    type: 'text',
    label: 'Parágrafo',
    initialContent: 'Parágrafo de texto editável.',
    initialFontSize: '16',
    initialColor: '#FFFFFF',
  },
  {
    type: 'heading',
    label: 'Título (H1)',
    initialContent: 'Seu Título Aqui',
    initialFontSize: '32',
    initialColor: '#FFFFFF',
  },
  {
    type: 'list',
    label: 'Lista',
    initialContent: '<li>Item 1</li>\n<li>Item 2</li>\n<li>Item 3</li>',
    initialFontSize: '16',
    initialColor: '#FFFFFF',
  },
  {
    type: 'image',
    label: 'Imagem',
    initialSrc: 'https://via.placeholder.com/150x100.png?text=Arraste+Imagem',
    initialWidth: 150,
    initialHeight: 100,
  },
];

const HtmlBlocksPanel: React.FC = () => {
  const { settings } = useBanner();

  return (
    <div>
      <h3 style={{textTransform: 'uppercase', letterSpacing: '1.2px'}}>Arraste Blocos para o Banner</h3>
      <div className="html-blocks-container">
        {availableBlocks.map((blockOpt) => (
          <DraggableBlockOption key={blockOpt.label + blockOpt.type} blockData={blockOpt} />
        ))}
      </div>
      <hr style={{borderColor: 'var(--border-color)', margin: '20px 0'}}/>
      <h3 style={{textTransform: 'uppercase', letterSpacing: '1.2px'}}>Elementos Adicionados</h3>
      <div id="addedElementsList" className="added-elements-list-container"> {/* Adicionada uma classe container */}
        {settings.addedBlocks.length === 0 ? (
          <p className="no-elements-message" style={{color: 'var(--text-color-muted)', fontSize: '0.85em', textAlign: 'center'}}>
            Nenhum elemento adicionado ainda.
          </p>
        ) : (
          settings.addedBlocks.map(block => (
            <AddedBlockItem key={block.id} block={block} />
          ))
        )}
      </div>
    </div>
  );
};

export default HtmlBlocksPanel;