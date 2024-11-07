import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type === 'audio/x-m4a') {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type === 'audio/x-m4a') {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
    >
      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <p className="mb-4 text-gray-400">
        Drag and drop your M4A file here, or click to select
      </p>
      <input
        type="file"
        accept="audio/x-m4a"
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg cursor-pointer inline-block transition-colors"
      >
        Select File
      </label>
    </div>
  );
};

export default FileUpload;