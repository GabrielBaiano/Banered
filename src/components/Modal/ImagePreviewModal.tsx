import React from 'react';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  downloadName: string;
  imageType: string;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  downloadName,
  // imageType, // Não é estritamente usado aqui se downloadName já tem a extensão
}) => {
  if (!isOpen || !imageSrc) {
    return null;
  }

  return (
    // Adiciona a classe 'open' baseada no estado isOpen
    <div className={`image-modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="image-modal-close-btn" onClick={onClose} title="Fechar">×</button>
        <h4>PRÉVIA DA IMAGEM GERADA</h4>
        <img src={imageSrc} alt="Banner Gerado" className="generated-image-in-modal" />
        <div className="image-modal-actions">
          <a href={imageSrc} download={downloadName} className="button-primary">
            BAIXAR IMAGEM
          </a>
          <a href={imageSrc} target="_blank" rel="noopener noreferrer" className="button-secondary">
            ABRIR EM NOVA GUIA
          </a>
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal;