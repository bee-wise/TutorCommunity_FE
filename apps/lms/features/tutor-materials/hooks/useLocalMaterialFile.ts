"use client";
import { useEffect, useState } from "react";
import { readLocalFile } from "../services/local-files.service";

export function useLocalMaterialFile(id: string, hasLocalFile?: boolean) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!hasLocalFile) return;
    let disposed = false;
    let objectUrl: string | undefined;
    void readLocalFile(id).then((file) => {
      if (disposed) return;
      if (!file) { setError("Không tìm thấy tệp trong bộ nhớ trình duyệt."); return; }
      objectUrl = URL.createObjectURL(file);
      setUrl(objectUrl);
    }).catch((reason: unknown) => {
      if (!disposed) setError(reason instanceof Error ? reason.message : "Không thể đọc tệp.");
    });
    return () => { disposed = true; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [hasLocalFile, id]);
  return { url, error };
}
