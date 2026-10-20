"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Upload, X, FileText, File as FileIcon, Image as ImageIcon } from "lucide-react";
import clsx from "clsx";

interface FileItem {
  id: string;
  file: File;
  preview?: string;
}

interface FileUploadProps {
  accept?: string[];
  maxSize?: number;
  maxFiles?: number;
  /** Files to show when the component (re)mounts, e.g. when returning to a form step. */
  initialFiles?: File[];
  onFilesChange?: (files: File[]) => void;
}

// Must match what the backend accepts (it checks the file bytes, not just the type).
const DEFAULT_ACCEPT = ["application/pdf", "image/png", "image/jpeg", "image/webp"];

function toItem(file: File): FileItem {
  return {
    id: Math.random().toString(36).slice(2),
    file,
    preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
  };
}

export default function FileUpload({
  accept = DEFAULT_ACCEPT,
  maxSize = 5 * 1024 * 1024,
  maxFiles = 5,
  initialFiles = [],
  onFilesChange,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileItem[]>(() => initialFiles.map(toItem));
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef(files);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  // Release image previews when the component goes away.
  useEffect(() => () => filesRef.current.forEach((f) => f.preview && URL.revokeObjectURL(f.preview)), []);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    setError("");
    const valid: FileItem[] = [];

    for (const f of Array.from(newFiles)) {
      if (!accept.includes(f.type)) {
        setError(`"${f.name}" is not a PDF, PNG, JPEG or WEBP file`);
        continue;
      }
      if (f.size > maxSize) {
        setError(`"${f.name}" exceeds max size of ${Math.round(maxSize / 1024 / 1024)}MB`);
        continue;
      }
      if (files.length + valid.length >= maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        break;
      }
      valid.push(toItem(f));
    }

    if (valid.length) {
      const updated = [...files, ...valid];
      setFiles(updated);
      onFilesChange?.(updated.map((f) => f.file));
    }
  }, [accept, files, maxSize, maxFiles, onFilesChange]);

  const removeFile = (id: string) => {
    const removed = files.find((f) => f.id === id);
    if (removed?.preview) URL.revokeObjectURL(removed.preview);
    const updated = files.filter((f) => f.id !== id);
    setFiles(updated);
    onFilesChange?.(updated.map((f) => f.file));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon size={16} className="text-zinc-400" />;
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
          <p className="text-xs text-zinc-400 mt-0.5">PDF or images, up to {Math.round(maxSize / 1024 / 1024)}MB each, {maxFiles} files max</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept.join(",")}
          onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }}
          className="hidden"
        />
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      {files.length > 0 && (
        <div className="space-y-1.5">
          {files.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-zinc-100 group">
              {item.preview ? (
                // eslint-disable-next-line @next/next/no-img-element -- local blob preview
                <img src={item.preview} alt="" className="w-9 h-9 rounded object-cover" />
              ) : (
                <div className="w-9 h-9 bg-zinc-50 rounded flex items-center justify-center">
                  {getFileIcon(item.file.type)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.file.name}</p>
                <span className="text-xs text-zinc-400">{(item.file.size / 1024).toFixed(0)} KB · uploaded with the claim</span>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(item.id); }}
                aria-label={`Remove ${item.file.name}`}
                className="p-1 rounded text-zinc-400 hover:text-zinc-600 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
