import React, { useState, useRef } from 'react';
import { Paperclip, Loader2, X, Image as ImageIcon, File as FileIcon, UploadCloud } from 'lucide-react';
import { useFileStore } from '@/store/fileStore';

export function FileUpload({ projectId, taskId, onUploadSuccess }) {
  const { uploadFile } = useFileStore();
  const [isUploading, setIsUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setPreviewFile(file);
    }
  };

  const handleUpload = async () => {
    if (!previewFile) return;

    setIsUploading(true);
    const result = await uploadFile({ file: previewFile, projectId, taskId });
    setIsUploading(false);

    if (result.success) {
      setPreviewFile(null);
      if (onUploadSuccess) onUploadSuccess(result.data.file);
    } else {
      alert(`Upload failed: ${result.error}`);
    }
  };

  const cancelUpload = () => {
    setPreviewFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
      
      {!previewFile ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-4 border-2 border-dashed border-brand-accent/30 hover:border-brand-accent bg-brand-surface/50 hover:bg-brand-accent/5 rounded-xl flex flex-col items-center justify-center gap-2 transition-all group">
            <Upload size={24} className="text-brand-accent group-hover:-translate-y-1 transition-transform" />
            <span className="text-sm font-medium text-white transition-colors">Click to attach file</span>
          <span className="text-[10px] text-brand-muted">Max 5MB (Images, PDF, Docs)</span>
        </button>
      ) : (
        <div className="bg-brand-elevated border border-brand-accent/30 rounded-xl p-3 flex flex-col sm:flex-row items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-base text-brand-accent shrink-0 border border-brand-accent/20">
            {previewFile.type.startsWith('image/') ? <ImageIcon size={20} /> : <FileIcon size={20} />}
          </div>
          
          <div className="flex-1 min-w-0 text-center sm:text-left w-full">
            <p className="text-sm text-theme-text font-medium truncate">{previewFile.name}</p>
            <p className="text-[10px] text-brand-muted">{(previewFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
            <button
              type="button"
              onClick={cancelUpload}
              disabled={isUploading}
              className="p-2 rounded-lg text-brand-secondary hover:text-brand-danger hover:bg-brand-danger/10 transition-colors disabled:opacity-50"
            >
              <X size={16} />
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className="flex-1 sm:flex-none py-2 px-4 rounded-lg font-bold text-xs text-theme-text flex items-center justify-center gap-2 transition-all disabled:opacity-60 bg-gradient-to-r from-brand-accent to-brand-danger shadow-[0_4px_10px_rgba(247,127,0,0.2)] hover:shadow-[0_4px_15px_rgba(247,127,0,0.4)]"
            >
              {isUploading ? <Loader2 size={14} className="animate-spin" /> : 'Upload'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
