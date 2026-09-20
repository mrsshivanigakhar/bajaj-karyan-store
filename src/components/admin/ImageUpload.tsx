'use client';

import React, { useState, useRef } from 'react';
import { Upload, Trash2, Loader2, AlertCircle, CheckCircle2, Link2, X } from 'lucide-react';
import { uploadImageAction } from '@/actions/upload';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: 'products' | 'categories';
  label?: string;
  description?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder = 'products',
  label = 'Product Image',
  description = 'Upload an image from your computer to store it in cloud storage.',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [manualUrlInput, setManualUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    // Check mime type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WebP, GIF, or SVG).');
      return;
    }

    // Check size limit (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 10MB limit. Please choose a smaller image.');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const result = await uploadImageAction(formData);

      if (result.success && result.url) {
        onChange(result.url);
      } else {
        setErrorMessage(result.error || 'Failed to upload image. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Unexpected error during upload.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
        className="hidden"
        onChange={handleInputChange}
        disabled={isUploading}
      />

      {/* Error message */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="ml-auto text-xs underline font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Preview if image exists */}
      {value ? (
        <div className="p-3 bg-rose-50/40 rounded-2xl border border-rose-200/80 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-white border border-rose-200 shrink-0 shadow-2xs group">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="flex-1 min-w-0 space-y-2 w-full">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100/80 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Image Active & Secure</span>
              </span>
            </div>

            <p className="text-[11px] text-gray-500">
              Ready for display across store catalog and product details.
            </p>

            <div className="flex items-center gap-2 pt-0.5 flex-wrap">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-white hover:bg-rose-50 text-[#800f2f] border border-rose-300 px-3.5 py-1.5 rounded-xl transition disabled:opacity-50 shadow-2xs"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Change Image</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setManualUrlInput('');
                  setShowManualUrl((prev) => !prev);
                }}
                disabled={isUploading}
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-white hover:bg-rose-50 text-gray-700 hover:text-[#800f2f] border border-gray-200 hover:border-rose-300 px-3 py-1.5 rounded-xl transition disabled:opacity-50 shadow-2xs"
              >
                <Link2 className="w-3.5 h-3.5 text-rose-700" />
                <span>Enter URL Manually</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setManualUrlInput('');
                  setShowManualUrl(false);
                }}
                disabled={isUploading}
                className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 border border-transparent px-2.5 py-1.5 rounded-xl transition"
                title="Remove image"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>

            {/* Manual URL input drawer for active image */}
            {showManualUrl && (
              <div className="mt-2.5 p-2.5 bg-white rounded-xl border border-rose-200 shadow-2xs space-y-1.5">
                <label className="block text-[11px] font-semibold text-gray-600">
                  Paste New Image URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={manualUrlInput}
                    onChange={(e) => setManualUrlInput(e.target.value)}
                    placeholder="Paste new image URL here (e.g. https://... or /images/...)"
                    className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#800f2f] text-gray-800"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (manualUrlInput.trim()) {
                        onChange(manualUrlInput.trim());
                      }
                      setManualUrlInput('');
                      setShowManualUrl(false);
                    }}
                    className="px-3.5 py-1.5 bg-[#800f2f] hover:bg-[#a4133c] text-white rounded-lg text-xs font-bold transition shadow-2xs shrink-0"
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setManualUrlInput('');
                      setShowManualUrl(false);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-lg shrink-0"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Dropzone / Upload trigger */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-[#800f2f] bg-rose-50'
              : 'border-rose-200 bg-rose-50/20 hover:bg-rose-50/50 hover:border-rose-300'
          }`}
        >
          {isUploading ? (
            <div className="py-3 flex flex-col items-center gap-2 text-[#800f2f]">
              <Loader2 className="w-8 h-8 animate-spin text-[#800f2f]" />
              <span className="text-xs font-bold">Uploading to Storage...</span>
              <span className="text-[11px] text-gray-500">Please wait a moment</span>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-rose-100/70 text-[#800f2f] flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-gray-800">
                  <span className="text-[#800f2f] underline underline-offset-2">Click to upload image</span> or drag and drop
                </p>
                <p className="text-[11px] text-gray-500">
                  PNG, JPG, WebP, GIF, or SVG (Up to 10MB)
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Footer / Manual URL toggle when empty */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        {description && !value && (
          <p className="text-[11px] text-gray-400">{description}</p>
        )}
        {!value && (
          <button
            type="button"
            onClick={() => {
              setManualUrlInput('');
              setShowManualUrl((prev) => !prev);
            }}
            className="text-xs font-semibold text-[#800f2f] hover:underline inline-flex items-center gap-1.5 ml-auto shrink-0"
          >
            <Link2 className="w-3.5 h-3.5 text-[#800f2f]" />
            <span>Enter URL Manually</span>
          </button>
        )}
      </div>

      {showManualUrl && !value && (
        <div className="p-3 bg-white rounded-2xl border border-rose-200 shadow-2xs space-y-2">
          <label className="block text-xs font-bold text-gray-700">
            Direct Image URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={manualUrlInput}
              onChange={(e) => setManualUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg or /images/..."
              className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#800f2f] text-gray-800"
            />
            <button
              type="button"
              onClick={() => {
                if (manualUrlInput.trim()) {
                  onChange(manualUrlInput.trim());
                }
                setShowManualUrl(false);
              }}
              className="px-4 py-2 bg-[#800f2f] hover:bg-[#a4133c] text-white rounded-xl text-xs font-bold transition shadow-2xs shrink-0"
            >
              Set Image
            </button>
            <button
              type="button"
              onClick={() => setShowManualUrl(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-xl shrink-0"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
