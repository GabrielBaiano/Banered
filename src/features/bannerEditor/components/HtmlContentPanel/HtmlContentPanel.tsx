import React, { useState } from 'react';

const HtmlContentPanel: React.FC = () => {
  const [htmlContent, setHtmlContent] = useState(''); // Gerenciar o estado do textarea

  return (
    <div className="setting-group html-editor-group"> {/* Classe do seu style.css */}
      <label htmlFor="htmlEditor">Editar Conteúdo HTML:</label>
      <textarea
        id="htmlEditor"
        rows={10}
        cols={30}
        value={htmlContent}
        onChange={(e) => setHtmlContent(e.target.value)}
      />
      <p className="warning-text">
        <strong>Atenção:</strong> Editar o HTML aqui pode quebrar o posicionamento exato de elementos arrastados. Use a aba "Blocos HTML" para controle visual.
      </p>
    </div>
  );
};
export default HtmlContentPanel;