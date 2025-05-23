// src/features/bannerEditor/EditorPage.tsx
import React, { useState, useRef, useEffect, CSSProperties, DragEvent, ChangeEvent } from 'react';
import ControlPanel from './components/ControlPanel/ControlPanel';
import type { BannerSettings } from './contexts/BannerContext'; // Importação de tipo
import { BannerProvider, useBanner } from './contexts/BannerContext';
// SelectInputGroup e CheckboxInputGroup são usados no ControlPanel
import ImagePreviewModal from '../../components/Modal/ImagePreviewModal'; // Ajuste o caminho se o modal estiver em src/components
import html2canvas from 'html2canvas';
import type { BlockType, BannerBlock, DraggableBlockOptionData, TextContentBlock, ImageContentBlock } from './types/bannerContentTypes'; // Verifique este caminho
import { v4 as uuidv4 } from 'uuid';

// Componentes de renderização de bloco
import TextBlockRenderer from './components/CanvasBlocks/TextBlockRenderer';
import ImageBlockRenderer from './components/CanvasBlocks/ImageBlockRenderer';

const defaultBannerUISettings: Pick<BannerSettings, 'backgroundColor'> = {
    backgroundColor: '#2D2D2D',
};

interface BannerPreviewProps {
    // Props adicionais se necessário no futuro
}

const BannerPreview = React.forwardRef<HTMLDivElement, BannerPreviewProps>((props, ref) => {
    const { settings, addBlock, updateBlock } = useBanner();

    const [draggingBlockId, setDraggingBlockId] = useState<string | null>(null);
    const [dragStartOffset, setDragStartOffset] = useState<{ x: number; y: number } | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [pendingImageDrop, setPendingImageDrop] = useState<{ x: number, y: number } | null>(null);

    const visualBackgroundColor = settings.backgroundImage
        ? 'transparent'
        : (settings.backgroundColor === defaultBannerUISettings.backgroundColor
            ? 'transparent'
            : settings.backgroundColor);

    const bannerWrapperStyle: CSSProperties = {
        width: '100%',
        maxWidth: `${settings.width}px`,
        aspectRatio: `${settings.width} / ${settings.height}`,
        margin: '0 auto',
        position: 'relative',
        transition: 'max-width 0.3s ease, aspect-ratio 0.3s ease',
    };

    const editableContainerStyle: CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: visualBackgroundColor,
        backgroundImage: settings.backgroundImage ? `url(${settings.backgroundImage})` : 'none',
        backgroundPosition: `${settings.backgroundPositionX}% ${settings.backgroundPositionY}%`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        fontFamily: settings.fontFamily,
        borderRadius: `${settings.borderRadius}px`,
        color: 'white',
        boxSizing: 'border-box',
        overflow: 'hidden',
        transition: 'all 0.3s ease, box-shadow 0.3s ease',
    };

    const handleCanvasDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (event.dataTransfer.types.includes("application/banner-block-move")) {
            event.dataTransfer.dropEffect = "move";
        } else if (event.dataTransfer.types.includes("application/json")) {
            event.dataTransfer.dropEffect = "copy";
        } else {
            event.dataTransfer.dropEffect = "none";
        }
        event.currentTarget.classList.add('drag-over-active');
    };

    const handleCanvasDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.currentTarget.classList.remove('drag-over-active');
    };

    const handleCanvasDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.currentTarget.classList.remove('drag-over-active');
        const bannerElement = event.currentTarget;
        const bannerRect = bannerElement.getBoundingClientRect();
        const movedBlockId = event.dataTransfer.getData("application/banner-block-move");

        if (movedBlockId && draggingBlockId === movedBlockId && dragStartOffset) {
            const blockToMove = settings.addedBlocks.find(b => b.id === movedBlockId);
            if (blockToMove && !blockToMove.locked) {
                let newX = event.clientX - bannerRect.left - dragStartOffset.x;
                let newY = event.clientY - bannerRect.top - dragStartOffset.y;
                const blockWidth = (typeof blockToMove.width === 'number' ? blockToMove.width : 0) || (blockToMove.type === 'image' ? 150 : 50);
                const blockHeight = (typeof blockToMove.height === 'number' ? blockToMove.height : 0) || (blockToMove.type === 'image' ? 100 : 20);
                newX = Math.max(0, Math.min(Math.round(newX), settings.width - blockWidth));
                newY = Math.max(0, Math.min(Math.round(newY), settings.height - blockHeight));
                updateBlock({ ...blockToMove, x: newX, y: newY });
            }
            setDraggingBlockId(null);
            setDragStartOffset(null);
        } else {
            const droppedDataString = event.dataTransfer.getData("application/json");
            if (!droppedDataString) return;
            const droppedBlockData: Partial<DraggableBlockOptionData> = JSON.parse(droppedDataString);
            const dropX = Math.max(0, Math.round(event.clientX - bannerRect.left));
            const dropY = Math.max(0, Math.round(event.clientY - bannerRect.top));

            if (droppedBlockData.type === 'image') {
                setPendingImageDrop({ x: dropX, y: dropY });
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                    fileInputRef.current.click();
                }
            } else if (droppedBlockData.type === 'text' || droppedBlockData.type === 'heading' || droppedBlockData.type === 'list') {
                const newBlockBase: Omit<BannerBlock, "type" | "htmlContent" | "src" | "alt" | "fontSize" | "color" | "fontWeight" | "fontStyle" | "textAlign" | "fontFamily" | "lineHeight"> & { type: BlockType } = {
                    id: uuidv4(), type: droppedBlockData.type!,
                    x: dropX, y: dropY, locked: false,
                };
                const newCompleteBlock = {
                    ...newBlockBase, type: droppedBlockData.type,
                    htmlContent: droppedBlockData.initialContent || '', fontSize: `${droppedBlockData.initialFontSize || '16'}px`,
                    color: droppedBlockData.initialColor || '#FFFFFF', fontWeight: 'normal', fontStyle: 'normal', textAlign: 'left',
                    fontFamily: undefined, lineHeight: 1.5,
                } as TextContentBlock;
                addBlock(newCompleteBlock);
            } else {
                console.error("Tipo de bloco desconhecido:", droppedBlockData.type);
            }
        }
    };

    const handleFileSelectedForNewBlock = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0] && pendingImageDrop) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target?.result as string;
                const img = new Image();
                img.onload = () => {
                    const MAX_INITIAL_DIM = 200;
                    let initialWidth = img.naturalWidth;
                    let initialHeight = img.naturalHeight;
                    if (initialWidth > MAX_INITIAL_DIM || initialHeight > MAX_INITIAL_DIM) {
                        if (initialWidth > initialHeight) {
                            initialHeight = Math.round((MAX_INITIAL_DIM / initialWidth) * initialHeight);
                            initialWidth = MAX_INITIAL_DIM;
                        } else {
                            initialWidth = Math.round((MAX_INITIAL_DIM / initialHeight) * initialWidth);
                            initialHeight = MAX_INITIAL_DIM;
                        }
                    }
                    initialWidth = Math.min(initialWidth, settings.width - pendingImageDrop.x);
                    initialHeight = Math.min(initialHeight, settings.height - pendingImageDrop.y);
                    const newImageBlock: ImageContentBlock = {
                        id: uuidv4(), type: 'image',
                        x: pendingImageDrop.x, y: pendingImageDrop.y,
                        src: dataUrl, alt: file.name,
                        width: initialWidth, height: initialHeight, locked: false,
                    };
                    addBlock(newImageBlock);
                    setPendingImageDrop(null);
                };
                img.src = dataUrl;
            };
            reader.readAsDataURL(file);
        } else {
            setPendingImageDrop(null);
        }
    };

    const handleBlockDragStart = (event: DragEvent<HTMLDivElement>, blockId: string) => {
        const currentBlock = settings.addedBlocks.find(b => b.id === blockId);
        if (currentBlock && currentBlock.locked) {
            event.preventDefault(); return;
        }
        const blockElement = event.currentTarget;
        const blockRect = blockElement.getBoundingClientRect();
        const offsetX = event.clientX - blockRect.left;
        const offsetY = event.clientY - blockRect.top;
        setDraggingBlockId(blockId);
        setDragStartOffset({ x: offsetX, y: offsetY });
        event.dataTransfer.setData("application/banner-block-move", blockId);
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <div style={bannerWrapperStyle} className="banner-visual-wrapper">
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileSelectedForNewBlock} />
            <div
                ref={ref}
                id="editableContainer"
                className="editable-canvas"
                style={editableContainerStyle}
                onDragOver={handleCanvasDragOver}
                onDragLeave={handleCanvasDragLeave}
                onDrop={handleCanvasDrop}
            >
                {settings.addedBlocks.map(block => {
                    if (block.type === 'text' || block.type === 'heading' || block.type === 'list') {
                        return <TextBlockRenderer key={block.id} block={block as TextContentBlock} onDragStart={(e) => handleBlockDragStart(e as DragEvent<HTMLDivElement>, block.id)} />;
                    }
                    if (block.type === 'image') {
                        return <ImageBlockRenderer key={block.id} block={block as ImageContentBlock} onDragStart={handleBlockDragStart} />;
                    }
                    return null;
                })}
                {settings.addedBlocks.length === 0 && (
                    <div style={{ pointerEvents: 'none', textAlign: 'center', opacity: 0.5, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%' }}>
                         Arraste blocos aqui <br/> ({settings.width}px x {settings.height}px)
                    </div>
                )}
            </div>
        </div>
    );
});
BannerPreview.displayName = 'BannerPreview';


const EditorPageContent: React.FC = () => {
    // Obtém settings e as funções de action do contexto
    const { settings, registerActionHandlers, setIsCapturingState } = useBanner();
    const bannerPreviewRef = useRef<HTMLDivElement>(null);
    // applyChangesBtnRef foi movido para o ControlPanel. Se precisar da ref aqui, repense a lógica.

    // Estado para o Modal de Preview da Imagem Gerada
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImageSrc, setModalImageSrc] = useState<string | null>(null);
    const [modalDownloadName, setModalDownloadName] = useState<string>('banner.png');

    // As funções de manipulação de imagem e apply changes são definidas aqui
    // porque elas podem precisar de acesso a refs (como bannerPreviewRef) ou
    // controlar estados locais (como o do modal).
    const handleGenerateImageInternal = async () => {
        if (!bannerPreviewRef.current) { 
            console.error("Referência do Banner preview não encontrada.");
            return; 
        }
        
        document.body.classList.add('is-capturing');
        setIsCapturingState(true); // Atualiza o estado global de captura
        await new Promise(resolve => setTimeout(resolve, 200));

        const captureElement = bannerPreviewRef.current;
        window.getComputedStyle(captureElement).opacity; // Força recálculo de estilo
        const rect = captureElement.getBoundingClientRect();

        let finalBackgroundColorForCanvasOption: string | null = null;
        const currentElementVisualBackgroundColor = settings.backgroundImage 
            ? 'transparent' 
            : (settings.backgroundColor === defaultBannerUISettings.backgroundColor 
                ? 'transparent' 
                : settings.backgroundColor);

        if (settings.imageExportType === 'png' && settings.transparentBackground) {
            if (!settings.backgroundImage && settings.backgroundColor === defaultBannerUISettings.backgroundColor) {
                finalBackgroundColorForCanvasOption = null;
            } else if (settings.backgroundImage) {
                finalBackgroundColorForCanvasOption = null;
            } else {
                 finalBackgroundColorForCanvasOption = null; // Força transparência se marcado, mesmo com cor de fundo
            }
        } else {
            finalBackgroundColorForCanvasOption = currentElementVisualBackgroundColor;
            if (settings.imageExportType === 'jpeg' && (!finalBackgroundColorForCanvasOption || finalBackgroundColorForCanvasOption === 'transparent')) {
                finalBackgroundColorForCanvasOption = '#FFFFFF';
            }
        }
        
        const originalElementInlineBg = captureElement.style.backgroundColor;
        // Ajusta o estilo do elemento DOM temporariamente para a captura
        if (finalBackgroundColorForCanvasOption === null) { // Se o canvas do html2canvas será transparente
            captureElement.style.backgroundColor = 'transparent'; // Garante que o elemento também seja
        } else {
            captureElement.style.backgroundColor = finalBackgroundColorForCanvasOption; // Usa a cor calculada
        }

        try {
            const canvas = await html2canvas(captureElement, {
                scale: 1, 
                width: Math.round(rect.width), 
                height: Math.round(rect.height),
                useCORS: true, 
                backgroundColor: finalBackgroundColorForCanvasOption,
                logging: false, 
                removeContainer: true,
            });

            // Restaura o estilo do elemento original o mais rápido possível
            captureElement.style.backgroundColor = originalElementInlineBg;

            let finalCanvas = canvas;
            // Lógica de arredondamento para PNGs
            if (settings.imageExportType === 'png' && settings.borderRadius > 0 ) {
                const roundedCanvas = document.createElement('canvas');
                roundedCanvas.width = canvas.width; 
                roundedCanvas.height = canvas.height;
                const ctx = roundedCanvas.getContext('2d');
                if (ctx) {
                    // Escala o raio se a captura foi feita com scale > 1 (aqui scale é 1, então canvas.width === rect.width)
                    const r = settings.borderRadius; // * (canvas.width / rect.width) - não necessário com scale 1
                    const w = canvas.width; const h = canvas.height;
                    ctx.beginPath();
                    ctx.moveTo(r, 0);   ctx.lineTo(w - r, 0); ctx.arcTo(w, 0, w, r, r);
                    ctx.lineTo(w, h - r); ctx.arcTo(w, h, w - r, h, r);
                    ctx.lineTo(r, h);   ctx.arcTo(0, h, 0, h - r, r);
                    ctx.lineTo(0, r);   ctx.arcTo(0, 0, r, 0, r);
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(canvas, 0, 0, w, h);
                    finalCanvas = roundedCanvas;
                }
            }

            const dataUrl = finalCanvas.toDataURL(`image/${settings.imageExportType}`, settings.imageExportType === 'jpeg' ? 0.92 : undefined);
            setModalImageSrc(dataUrl);
            setModalDownloadName(`banner-${Math.round(rect.width)}x${Math.round(rect.height)}.${settings.imageExportType}`);
            setIsModalOpen(true); // Abre o Modal

        } catch (error) {
            console.error('Erro ao gerar a imagem:', error);
            // Garante restauração do BG em caso de erro
            captureElement.style.backgroundColor = originalElementInlineBg;
        } finally {
            // Garante que o estilo do elemento DOM seja restaurado se ainda não foi
             if (captureElement.style.backgroundColor !== originalElementInlineBg) {
                captureElement.style.backgroundColor = originalElementInlineBg;
            }
            setIsCapturingState(false); // Atualiza o estado global de captura
            document.body.classList.remove('is-capturing'); // Remove a classe ao final
        }
    };

    const handleApplyChangesInternal = () => {
        console.log("Configurações aplicadas (simulado). Estado atual:", settings);
        // A lógica de feedback visual do botão ("ATUALIZADO!") está agora no ControlPanel
    };

    // Registra os handlers no contexto para que o ControlPanel possa chamá-los
    useEffect(() => {
        if (typeof registerActionHandlers === 'function') {
            registerActionHandlers({
                generateImage: handleGenerateImageInternal,
                applyChanges: handleApplyChangesInternal,
            });
        } else {
            // Este log é importante para depurar se o erro "registerActionHandlers is not a function" voltar
            console.error("EditorPageContent: registerActionHandlers não é uma função no momento do registro.");
        }
    // Adicione dependências que, se mudarem, exigem que os handlers sejam re-registrados
    // porque os handlers podem ter "fechado" sobre valores antigos dessas dependências.
    // settings contém muitas coisas, então é uma dependência ampla. Se houver problemas de performance,
    // pode ser necessário ser mais específico ou usar useCallback para os handlers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [registerActionHandlers, settings]); // Re-registra se settings mudar

    // useEffect para esconder/mostrar menu durante settings.isCapturing (do contexto)
    useEffect(() => {
        const blackMenu = document.querySelector('.black-menu') as HTMLElement | null;
        
        if (settings.isCapturing) {
            if (blackMenu && blackMenu.style.display !== 'none') {
                blackMenu.setAttribute('data-original-display', blackMenu.style.display || window.getComputedStyle(blackMenu).display);
                blackMenu.style.display = 'none';
            }
        } else {
            if (blackMenu && blackMenu.style.display === 'none') {
                const originalDisplay = blackMenu.getAttribute('data-original-display');
                blackMenu.style.display = originalDisplay || ''; // Restaura para o valor salvo ou CSS padrão
                blackMenu.removeAttribute('data-original-display');
            }
        }
    }, [settings.isCapturing]);


    return (
        // EditorPageContent agora renderiza apenas a área de preview do banner e o modal
        <>
            <div className="banner-preview-area">
                <div className="banner-preview-area-inner">
                    <BannerPreview ref={bannerPreviewRef} />
                </div>
                {/* OS BOTÕES E OPÇÕES DE EXPORTAÇÃO FORAM MOVIDOS PARA ControlPanel.tsx */}
            </div>
            <a href="https://github.com/GabrielBaiano" target="_blank" rel="noopener noreferrer" className="github-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="24" height="24" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"></path></svg>
            </a>
            <ImagePreviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                imageSrc={modalImageSrc}
                downloadName={modalDownloadName}
                imageType={settings.imageExportType} // Usa o tipo de imagem do contexto
            />
        </>
    );
};

// Componente EditorPage agora estrutura o layout principal e o Provider
const EditorPage: React.FC = () => {
    return (
        <BannerProvider>
            <div className="page-container"> {/* page-container aplica display:flex */}
                <ControlPanel /> {/* ControlPanel renderizado como filho direto de page-container */}
                <EditorPageContent /> {/* EditorPageContent renderizado como filho direto de page-container */}
            </div>
        </BannerProvider>
    );
};

export default EditorPage;