import React, { useRef } from 'react';

interface FileInputGroupProps {
  label: string;
  idSuffix: string;
  accept?: string;
  onChange: (file: File | null) => void;
}

const FileInputGroup: React.FC<FileInputGroupProps> = ({
  label,
  idSuffix,
  accept,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(e.target.files[0]);
    } else {
      onChange(null);
    }
  };

  // Opcional: Função para limpar o arquivo (se você adicionar um botão de "Remover Imagem")
  // const clearFile = () => {
  //   onChange(null);
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = ""; // Reseta o input de arquivo
  //   }
  // };

  return (
    <div className="setting-group">
      <label htmlFor={`file-${idSuffix}`}>{label}:</label>
      <input
        type="file"
        id={`file-${idSuffix}`}
        accept={accept}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      {/* Botão para limpar pode ser adicionado aqui */}
    </div>
  );
};

export default FileInputGroup;