import React, { useState, useRef } from 'react';
import { Paperclip, Loader2, X, Image as ImageIcon, File as FileIcon } from 'lucide-react';
import { useFileStore } from '@/store/fileStore';

export function ChatUpload({ projectId, onUploadSuccess }) {
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
    const result = await uploadFile({ file: previewFile, projectId });
    setIsUploading(false);

    if (result.success) {
      setPreviewFile(null);
      if (onUploadSuccess) onUploadSuccess(result.data.chatMessage);
    } else {
      alert(`Upload failed: ${result.error}`);
    }
  };

  const cancelUpload = () => {
    setPreviewFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="relative">
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
          className="p-3.5 rounded-xl bg-brand-elevated text-brand-secondary hover:text-brand-yellow hover:bg-brand-accent/10 border border-brand-accent/20 transition-all shadow-sm group">
                <FileText size={20} className="text-brand-accent group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{previewFile.name}</p>
              <p className="text-[10px] text-brand-muted">{(previewFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full py-2 rounded-lg font-bold text-xs text-theme-text flex items-center justify-center gap-2 transition-all disabled:opacity-60 bg-gradient-to-r from-brand-accent to-brand-danger hover:shadow-[0_0_10px_rgba(247,127,0,0.3)]"
          >
            {isUploading ? <Loader2 size={14} className="animate-spin" /> : 'Send File'}
          </button>
        </div>
      )}
    </div>
  );
}
