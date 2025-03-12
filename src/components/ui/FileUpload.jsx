import React from 'react';
import { Upload, X } from "lucide-react";
import { validateFile } from "../../utils/validators";

export const FileUpload = ({ 
  onFileSelect, 
  acceptedTypes, 
  maxSize = 5, 
  currentFile = null,
  onRemove = null,
  label = "Upload File" 
}) => {
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const errors = validateFile(file, maxSize, acceptedTypes);
    if (errors.length > 0) {
      // Handle errors (you can pass an onError callback if needed)
      console.error(errors);
      return;
    }

    onFileSelect(file);
  };

  return (
    <div className="space-y-2">
      {currentFile ? (
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <span className="text-sm truncate">{currentFile.name}</span>
          {onRemove && (
            <button
              onClick={onRemove}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      ) : (
        <label className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary">
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm font-medium">{label}</span>
          <span className="text-xs text-gray-500 mt-1">
            Max size: {maxSize}MB
          </span>
          <input
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept={acceptedTypes.join(',')}
          />
        </label>
      )}
    </div>
  );
};