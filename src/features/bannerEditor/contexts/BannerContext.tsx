import React, { createContext, useState, type ReactNode, useContext, useRef } from 'react';
import type { BannerBlock } from '../types/bannerContentTypes'; // Ajuste o caminho se necessário

// Cor padrão do canvas para a UI
const defaultBannerUISettings: { backgroundColor: string } = {
    backgroundColor: '#2D2D2D', // Cinza escuro neutro para o fundo do canvas na UI
};

export type ImageExportType = 'png' | 'jpeg' | 'webp';

export interface BannerSettings {
  width: number;
  height: number;
  borderRadius: number;
  backgroundColor: string; // Cor de fundo real do banner, pode ser alterada pelo usuário
  backgroundImage?: string;
  backgroundPositionX: number;
  backgroundPositionY: number;
  googleFontImportUrl: string;
  fontFamily: string;
  addedBlocks: BannerBlock[];
  // Configurações de exportação
  imageExportType: ImageExportType;
  transparentBackground: boolean;
  isCapturing: boolean; // Para o estado de captura
}

export interface BannerContextType {
  settings: BannerSettings;
  updateSettings: (newSettings: Partial<BannerSettings>) => void;
  applyGoogleFont: (url: string) => void;
  addBlock: (block: BannerBlock) => void;
  updateBlock: (updatedBlock: BannerBlock) => void;
  removeBlock: (blockId: string) => void;
  setAddedBlocks: (blocks: BannerBlock[]) => void; // Para reordenar ou carregar blocos
  setImageExportType: (type: ImageExportType) => void;
  setTransparentBackground: (isTransparent: boolean) => void;
  // Para registrar e disparar ações a partir do ControlPanel
  registerActionHandlers: (handlers: { generateImage: () => Promise<void>; applyChanges: () => void }) => void;
  triggerGenerateImage: () => Promise<void>;
  triggerApplyChanges: () => void;
  setIsCapturingState: (isCapturing: boolean) => void; // Para controlar isCapturing
}

const defaultSettings: BannerSettings = {
  width: 400,
  height: 200,
  borderRadius: 0,
  backgroundColor: defaultBannerUISettings.backgroundColor, // Usa a constante para a cor inicial do banner
  backgroundPositionX: 50,
  backgroundPositionY: 50,
  googleFontImportUrl: '',
  fontFamily: 'Poppins, sans-serif', // Alinhado com o global.css
  addedBlocks: [],
  imageExportType: 'png', // Default
  transparentBackground: true, // Default
  isCapturing: false, // Valor inicial para isCapturing
};

export const BannerContext = createContext<BannerContextType | undefined>(undefined);

const FONT_STYLE_ELEMENT_ID = 'dynamic-google-fonts-style';

export const BannerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettingsState] = useState<BannerSettings>(defaultSettings);
  
  // Refs para armazenar os handlers que serão registrados pelo EditorPageContent
  const generateImageHandlerRef = useRef<() => Promise<void>>(() => {
    console.warn("generateImageHandler não foi registrado no contexto ainda.");
    return Promise.resolve();
  });
  const applyChangesHandlerRef = useRef<() => void>(() => {
    console.warn("applyChangesHandler não foi registrado no contexto ainda.");
  });

  const updateSettings = (newSettings: Partial<BannerSettings>) => {
    setSettingsState(prevSettings => ({ ...prevSettings, ...newSettings }));
  };

  const applyGoogleFont = (url: string) => {
    updateSettings({ googleFontImportUrl: url }); // Salva a URL no estado
    const existingStyleElement = document.getElementById(FONT_STYLE_ELEMENT_ID);
    if (existingStyleElement) {
      existingStyleElement.remove();
    }
    if (url.trim() !== '') {
      const styleElement = document.createElement('style');
      styleElement.id = FONT_STYLE_ELEMENT_ID;
      if (url.startsWith('https://fonts.googleapis.com/css')) {
        styleElement.textContent = `@import url('${url}');`;
        document.head.appendChild(styleElement);
      } else {
        console.warn("URL de fonte inválida ou não suportada. Use o link @import do Google Fonts.");
      }
    }
  };

  const addBlock = (block: BannerBlock) => {
    console.log("Context: Adding block", block);
    setSettingsState(prev => ({
      ...prev,
      addedBlocks: [...prev.addedBlocks, block],
    }));
  };

  const updateBlock = (updatedBlock: BannerBlock) => {
    console.log("Context: Updating block", updatedBlock.id, updatedBlock);
    setSettingsState(prev => ({
      ...prev,
      addedBlocks: prev.addedBlocks.map(b =>
        b.id === updatedBlock.id ? { ...b, ...updatedBlock } : b // Mescla o bloco atual com as novas propriedades
      ),
    }));
  };

  const removeBlock = (blockId: string) => {
    console.log("Context: Removing block", blockId);
    setSettingsState(prev => ({
      ...prev,
      addedBlocks: prev.addedBlocks.filter(b => b.id !== blockId),
    }));
  };

  const setAddedBlocks = (blocks: BannerBlock[]) => {
    setSettingsState(prev => ({ ...prev, addedBlocks: blocks }));
  };

  const setImageExportType = (type: ImageExportType) => {
    updateSettings({ imageExportType: type });
  };

  const setTransparentBackground = (isTransparent: boolean) => {
    updateSettings({ transparentBackground: isTransparent });
  };

  const setIsCapturingState = (isCapturingValue: boolean) => {
    updateSettings({ isCapturing: isCapturingValue });
  };

  const registerActionHandlers = (handlers: { generateImage: () => Promise<void>; applyChanges: () => void }) => {
    generateImageHandlerRef.current = handlers.generateImage;
    applyChangesHandlerRef.current = handlers.applyChanges;
  };

  const triggerGenerateImage = async () => {
    if (generateImageHandlerRef.current) {
      await generateImageHandlerRef.current();
    }
  };

  const triggerApplyChanges = () => {
    if (applyChangesHandlerRef.current) {
      applyChangesHandlerRef.current();
    }
  };

  return (
    <BannerContext.Provider value={{
      settings,
      updateSettings,
      applyGoogleFont,
      addBlock,
      updateBlock, // Certifique-se que está aqui
      removeBlock, // Certifique-se que está aqui
      setAddedBlocks,
      setImageExportType,
      setTransparentBackground,
      registerActionHandlers,
      triggerGenerateImage,
      triggerApplyChanges,
      setIsCapturingState
    }}>
      {children}
    </BannerContext.Provider>
  );
};

export const useBanner = (): BannerContextType => {
  const context = useContext(BannerContext);
  if (context === undefined) {
    throw new Error('useBanner must be used within a BannerProvider');
  }
  return context;
};