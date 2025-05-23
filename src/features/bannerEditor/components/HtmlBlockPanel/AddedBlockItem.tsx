import React, { ChangeEvent } from 'react';
import type { BannerBlock, TextContentBlock, ImageContentBlock } from '../../types/bannerContentTypes';
import { useBanner } from '../../contexts/BannerContext';

interface AddedBlockItemProps {
  block: BannerBlock;
}

const AddedBlockItem: React.FC<AddedBlockItemProps> = ({ block }) => {
  const { settings: bannerSettings, updateBlock, removeBlock } = useBanner();

  const handleLockToggle = () => {
    updateBlock({ ...block, locked: !block.locked });
  };

  const handleRemove = () => {
    removeBlock(block.id);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    let finalValue: string | number | boolean = value;

    if (type === 'number') {
      const numVal = parseFloat(value);
      if (name === 'fontSize' || name === 'lineHeight') {
        finalValue = isNaN(numVal) || numVal <= 0 ? (name === 'fontSize' ? 16 : 1.5) : numVal;
      } else { // para x, y
        finalValue = isNaN(numVal) ? 0 : numVal;
      }
    }
    
    let updatePayload: Partial<BannerBlock> = { [name]: finalValue };

    if (name === 'fontSize' && typeof finalValue === 'number') {
        updatePayload = { ...updatePayload, [name]: `${finalValue}px` };
    } else if (name === 'lineHeight' && typeof finalValue === 'number') {
        updatePayload = { ...updatePayload, [name]: finalValue };
    } else if ((name === 'width' || name === 'height') && block.type === 'image') {
        const numVal = parseFloat(value);
        if (!isNaN(numVal) && String(value).match(/^\d+(\.\d+)?$/)) { // Se for apenas número (com ou sem decimal)
            updatePayload = { ...updatePayload, [name]: `${numVal}px`};
        } else if (value.trim().toLowerCase() === 'auto' || value.includes('%')) {
            updatePayload = { ...updatePayload, [name]: value };
        } else if (value.trim() === '') {
             updatePayload = { ...updatePayload, [name]: 'auto'};
        } else {
            // Mantém o valor como está se não for um número claro, 'auto' ou '%'
            // Isso permite que o usuário digite '150px' diretamente se quiser,
            // mas a conversão para número + 'px' acima é mais robusta se ele só digitar números.
             updatePayload = { ...updatePayload, [name]: value };
        }
    }

    updateBlock({ ...block, ...updatePayload });
  };
  
  const handleStyleToggle = (styleProp: 'fontWeight' | 'fontStyle', activeValue: string, defaultValue: string) => {
    if (block.type === 'text' || block.type === 'heading' || block.type === 'list') {
        const currentBlock = block as TextContentBlock;
        const currentValue = currentBlock[styleProp];
        updateBlock({
            ...currentBlock,
            [styleProp]: currentValue === activeValue ? defaultValue : activeValue,
        });
    }
  };

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0] && block.type === 'image') {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
            const MAX_EDIT_DIM = Math.min(bannerSettings.width, bannerSettings.height, 300);
            let newWidth: string | number = img.naturalWidth;
            let newHeight: string | number = img.naturalHeight;

            if (img.naturalWidth > MAX_EDIT_DIM || img.naturalHeight > MAX_EDIT_DIM) {
                if (img.naturalWidth > img.naturalHeight) {
                    newHeight = Math.round((MAX_EDIT_DIM / img.naturalWidth) * img.naturalHeight);
                    newWidth = MAX_EDIT_DIM;
                } else {
                    newWidth = Math.round((MAX_EDIT_DIM / img.naturalHeight) * img.naturalWidth);
                    newHeight = MAX_EDIT_DIM;
                }
            }
            updateBlock({ ...block, src: dataUrl, alt: file.name, width: newWidth, height: newHeight } as ImageContentBlock);
        }
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  let specificControls = null;
  if (block.type === 'text' || block.type === 'heading' || block.type === 'list') {
    const textBlock = block as TextContentBlock;
    specificControls = (
      <>
        <div className="setting-group">
          <label htmlFor={`htmlContent-${block.id}`}>CONTEÚDO:</label>
          <textarea id={`htmlContent-${block.id}`} name="htmlContent" value={textBlock.htmlContent} onChange={handleInputChange} rows={3} placeholder="Edite o conteúdo..." />
        </div>
        <div className="setting-group">
          <label htmlFor={`fontSize-${block.id}`}>TAMANHO FONTE (PX):</label>
          <input type="number" id={`fontSize-${block.id}`} name="fontSize" value={parseInt(textBlock.fontSize, 10) || 16} onChange={handleInputChange} min="1" max="200"/>
        </div>
        <div className="setting-group">
          <label htmlFor={`color-${block.id}`}>COR:</label>
          <input type="color" id={`color-${block.id}`} name="color" value={textBlock.color} onChange={handleInputChange} style={{height: '30px', padding: '2px'}} />
        </div>
        <div className="setting-group">
            <label htmlFor={`textAlign-${block.id}`}>ALINHAMENTO TEXTO:</label>
            <select id={`textAlign-${block.id}`} name="textAlign" value={textBlock.textAlign || 'left'} onChange={handleInputChange}>
                <option value="left">Esquerda</option> <option value="center">Centro</option> <option value="right">Direita</option>
            </select>
        </div>
        <div className="setting-group">
            <label htmlFor={`fontFamily-${block.id}`}>FONTE DO BLOCO:</label>
            <select id={`fontFamily-${block.id}`} name="fontFamily" value={textBlock.fontFamily || ''} onChange={handleInputChange} >
                <option value="">Padrão do Banner ({bannerSettings.fontFamily.split(',')[0]})</option>
                {[bannerSettings.fontFamily, 'Arial, sans-serif', 'Verdana, sans-serif', 'Georgia, serif', 'Times New Roman, Times, serif', 'Courier New, Courier, monospace']
                    .filter((font, index, self) => font && self.indexOf(font) === index) // Remove duplicatas e undefined
                    .map(font => (<option key={font} value={font}>{font.split(',')[0]}</option>))}
            </select>
        </div>
        <div className="setting-group">
          <label htmlFor={`lineHeight-${block.id}`}>ALTURA DA LINHA (EX: 1.5):</label>
          <input type="number" id={`lineHeight-${block.id}`} name="lineHeight" value={Number(textBlock.lineHeight) || 1.5} onChange={handleInputChange} step="0.1" min="0.5" max="3"/>
        </div>
        <div className="setting-group text-format-buttons">
            <button onClick={() => handleStyleToggle('fontWeight', 'bold', 'normal')} className={textBlock.fontWeight === 'bold' ? 'active' : ''} title="Negrito"> B </button>
            <button onClick={() => handleStyleToggle('fontStyle', 'italic', 'normal')} className={textBlock.fontStyle === 'italic' ? 'active' : ''} title="Itálico"> I </button>
        </div>
      </>
    );
  } else if (block.type === 'image') {
    const imageBlock = block as ImageContentBlock;
    specificControls = (
      <>
        <div className="setting-group">
          <label htmlFor={`imageFile-${block.id}`}>TROCAR IMAGEM (UPLOAD):</label>
          <input
            type="file"
            id={`imageFile-${block.id}`}
            name="imageFile"
            accept="image/*"
            onChange={handleImageFileChange}
            style={{marginBottom: '10px'}}
          />
          <label htmlFor={`src-display-${block.id}`} style={{fontSize: '0.7rem', opacity: 0.7}}>URL ATUAL / NOME:</label>
          <input
            type="text"
            id={`src-display-${block.id}`}
            value={imageBlock.src.startsWith('data:') ? (imageBlock.alt || 'Imagem Carregada Localmente') : imageBlock.src}
            readOnly
            style={{fontSize: '0.7rem', opacity: 0.7, border: 'none', background: 'transparent', paddingLeft: 0}}
          />
        </div>
        <div className="setting-group">
          <label htmlFor={`width-${block.id}`}>LARGURA (PX OU % OU 'AUTO'):</label> {/* Permitindo % */}
          <input
            type="text"
            id={`width-${block.id}`}
            name="width"
            value={String(imageBlock.width ?? 'auto')}
            onChange={handleInputChange}
            placeholder="Ex: 150, 150px, 50%, auto"
          />
        </div>
        <div className="setting-group">
          <label htmlFor={`height-${block.id}`}>ALTURA (PX OU % OU 'AUTO'):</label> {/* Permitindo % */}
          <input
            type="text"
            id={`height-${block.id}`}
            name="height"
            value={String(imageBlock.height ?? 'auto')}
            onChange={handleInputChange}
            placeholder="Ex: 100, 100px, auto"
          />
        </div>
        <div className="setting-group">
          <label htmlFor={`alt-${block.id}`}>TEXTO ALTERNATIVO:</label>
          <input
            type="text"
            id={`alt-${block.id}`}
            name="alt"
            value={imageBlock.alt || ''}
            onChange={handleInputChange}
            placeholder="Descrição da imagem..."
          />
        </div>
      </>
    );
  }

  return (
    <div className="added-element-item">
      <h4>
        {block.type.charAt(0).toUpperCase() + block.type.slice(1)} (ID: ...{block.id.slice(-4)})
        <div className="action-buttons">
          <button onClick={handleLockToggle} className={`lock-toggle ${block.locked ? 'active' : ''}`} title={block.locked ? 'Desbloquear' : 'Bloquear'}> {block.locked ? '🔒' : '🔓'} </button>
          <button onClick={handleRemove} className="remove-block-btn" title="Remover Elemento"> ❌ </button>
        </div>
      </h4>
      <div className="controls">
        <div className="setting-group">
          <label htmlFor={`pos-x-${block.id}`}>POS X:</label>
          <input type="number" id={`pos-x-${block.id}`} name="x" value={block.x} onChange={handleInputChange} />
        </div>
        <div className="setting-group">
          <label htmlFor={`pos-y-${block.id}`}>POS Y:</label>
          <input type="number" id={`pos-y-${block.id}`} name="y" value={block.y} onChange={handleInputChange} />
        </div>
        {specificControls}
      </div>
    </div>
  );
};

export default AddedBlockItem;