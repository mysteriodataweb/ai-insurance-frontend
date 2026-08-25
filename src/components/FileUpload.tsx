"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X, FileText, File as FileIcon, CheckCircle, Image } from "lucide-react";
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

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image size={16} className="text-zinc-400" />;
    if (type === "application/pdf") return <FileText size={16} className="text-zinc-400" />;
    return <FileIcon size={16} className="text-zinc-400" />;
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={clsx(
          "flex flex-col items-center justify-center gap-2 p-6 rounded-lg border border-dashed cursor-pointer transition-colors",
          isDragging ? "border-zinc-400 bg-zinc-50" : "border-zinc-200 hover:border-zinc-300"
        )}
      >
        <Upload size={18} className="text-zinc-400" />
        <div className="text-center">
          <p className="text-sm text-zinc-600">{isDragging ? "Drop files here" : "Click or drag files"}</p>
          <p className="text-xs text-zinc-400 mt-0.5">PDF, images up to {Math.round(maxSize / 1024 / 1024)}MB</p>
        </div>
        <input ref={inputRef} type="file" multiple accept={accept.join(",")} onChange={(e) => e.target.files && addFiles(e.target.files)} className="hidden" />
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      {files.length > 0 && (
        <div className="space-y-1.5">
          {files.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-zinc-100 group">
              {item.preview ? (
                <img src={item.preview} alt="" className="w-9 h-9 rounded object-cover" />
              ) : (
                <div className="w-9 h-9 bg-zinc-50 rounded flex items-center justify-center">
                  {getFileIcon(item.file.type)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.file.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">{(item.file.size / 1024).toFixed(0)} KB</span>
                  {item.status === "done" && (
                    <span className="flex items-center gap-1 text-xs text-zinc-500">
                      <CheckCircle size={11} /> Done
                    </span>
                  )}
                </div>
                {item.status !== "done" && (
                  <div className="mt-1 h-1 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-400 rounded-full transition-all duration-300" style={{ width: `${item.progress}%` }} />
                  </div>
                )}
              </div>
              <button onClick={(e) => { e.stopPropagation(); removeFile(item.id); }} className="p-1 rounded text-zinc-400 hover:text-zinc-600 opacity-0 group-hover:opacity-100 transition-all">
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
