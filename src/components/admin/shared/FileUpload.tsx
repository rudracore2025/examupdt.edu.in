import { useState, useRef } from 'react';
import { Upload, X, File, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../ui/button';

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  onFilesSelected: (files: File[]) => void;
  label?: string;
  existingFiles?: string[];
  onRemoveExisting?: (url: string) => void;
}

export function FileUpload({
  accept = '*',
  multiple = false,
  maxSize = 10,
  onFilesSelected,
  label = 'Upload File',
  existingFiles = [],
  onRemoveExisting,
}: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const sizeMB = file.size / (1024 * 1024);
      return sizeMB <= maxSize;
    });

    if (validFiles.length < fileArray.length) {
      alert(`Some files exceed ${maxSize}MB limit and were skipped`);
    }

    if (multiple) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      onFilesSelected([...selectedFiles, ...validFiles]);
    } else {
      setSelectedFiles(validFiles);
      onFilesSelected(validFiles);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-3">
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-colors
          ${dragActive ? 'border-[#004AAD] bg-[#004AAD]/5' : 'border-gray-300 hover:border-[#004AAD]'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-[#0A0A0A]/40 mx-auto mb-3" />
        <p className="text-[#0A0A0A] text-sm sm:text-base mb-1">{label}</p>
        <p className="text-[#0A0A0A]/60 text-xs sm:text-sm">
          Drag and drop or click to browse (max {maxSize}MB)
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Existing Files */}
      {existingFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-[#0A0A0A]/60">Current Files:</p>
          {existingFiles.map((url, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-[#F5F5F5] rounded-lg">
              <ImageIcon className="w-5 h-5 text-[#004AAD] flex-shrink-0" />
              <span className="text-sm text-[#0A0A0A] truncate flex-1">{url}</span>
              {onRemoveExisting && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveExisting(url)}
                  className="flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-[#0A0A0A]/60">Selected Files:</p>
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <File className="w-5 h-5 text-[#004AAD] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#0A0A0A] truncate">{file.name}</p>
                <p className="text-xs text-[#0A0A0A]/60">{formatFileSize(file.size)}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
