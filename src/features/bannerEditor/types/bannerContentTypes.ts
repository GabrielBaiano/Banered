export type BlockType = 'text' | 'heading' | 'list' | 'image';

interface BaseBlock {
  id: string;
  type: BlockType;
  x: number;
  y: number;
  width?: number | string;
  height?: number | string;
  locked: boolean;
}

export interface TextContentBlock extends BaseBlock {
  type: 'text' | 'heading' | 'list';
  htmlContent: string;
  fontSize: string;
  color: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  fontFamily?: string; // NOVO: Fonte individual do bloco
  lineHeight?: number | string; // NOVO: Altura da linha (ex: 1.5, ou "24px")
}

export interface ImageContentBlock extends BaseBlock {
  type: 'image';
  src: string;
  alt?: string;
  // objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none'; // Para futuro controle de object-fit
}

export type BannerBlock = TextContentBlock | ImageContentBlock;

export interface DraggableBlockOptionData {
    type: BlockType;
    label: string;
    initialContent?: string;
    initialFontSize?: string;
    initialColor?: string;
    initialSrc?: string;
    initialWidth?: number | string;
    initialHeight?: number | string;
    // Não precisamos de fontFamily ou lineHeight aqui, pois usarão o default do banner
}