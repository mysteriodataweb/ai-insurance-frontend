"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X, FileText, Image, File as FileIcon, CheckCircle } from "lucide-react";
import clsx from "clsx";

interface FileItem {
  id: string;
  file: File;
  preview?: string;
  status: "pending" | "uploading" | "done";
  progress: number;
}

interface FileUploadProps {
  accept?: string[];
  maxSize?: number;
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
}

export default function FileUpload({
  accept = ["image/*", "application/pdf"],
  maxSize = 10 * 1024 * 1024,
  maxFiles = 5,
  onFilesChange,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    setError("");
    const arr = Array.from(newFiles);
    const valid: FileItem[] = [];

    for (const f of arr) {
      if (f.size > maxSize) {
        setError(`"${f.name}" exceeds max size of ${Math.round(maxSize / 1024 / 1024)}MB`);
        continue;
      }
      if (files.length + valid.length >= maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        break;
      }
      const item: FileItem = {
        id: Math.random().toString(36).slice(2),
        file: f,
        status: "pending",
        progress: 0,
      };
      if (f.type.startsWith("image/")) {
        item.preview = URL.createObjectURL(f);
      }
      valid.push(item);
    }

    if (valid.length) {
      const updated = [...files, ...valid];
      setFiles(updated);
      onFilesChange?.(updated.map((f) => f.file));

      // Simulate upload progress
      valid.forEach((item) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 30 + 10;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setFiles((prev) =>
              prev.map((f) => (f.id === item.id ? { ...f, status: "done", progress: 100 } : f))
            );
          } else {
            setFiles((prev) =>
              prev.map((f) => (f.id === item.id ? { ...f, progress } : f))
            );
          }
        }, 200);
      });
    }
  }, [files, maxSize, maxFiles, onFilesChange]);

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      onFilesChange?.(updated.map((f) => f.file));
      return updated;
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image size={16} className="text-blue-500" />;
    if (type === "application/pdf") return <FileText size={16} className="text-red-500" />;
    return <FileIcon size={16} className="text-gray-500" />;
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={clsx(
          "relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300",
          isDragging
            ? "border-blue-400 bg-blue-50/50 scale-[1.01]"
            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/30"
        )}
      >
        <div className={clsx(
          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
          isDragging ? "bg-blue-100 scale-110" : "bg-gray-100"
        )}>
          <Upload size={20} className={isDragging ? "text-blue-500" : "text-gray-400"} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-700">
            {isDragging ? "Drop files here" : "Click or drag files to upload"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            PDF, Images up to {Math.round(maxSize / 1024 / 1024)}MB ({maxFiles} max)
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept.join(",")}
          onChange={(e) => e.target.files && addFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl">{error}</p>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 group">
              {/* Preview or Icon */}
              {item.preview ? (
                <img src={item.preview} alt="" className="w-10 h-10 rounded-lg object-cover" />
              ) : (
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                  {getFileIcon(item.file.type)}
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.file.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{(item.file.size / 1024).toFixed(0)} KB</span>
                  {item.status === "done" && (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle size={12} /> Uploaded
                    </span>
                  )}
                </div>
                {/* Progress bar */}
                {item.status !== "done" && (
                  <div className="mt-1.5 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Remove */}
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(item.id); }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}