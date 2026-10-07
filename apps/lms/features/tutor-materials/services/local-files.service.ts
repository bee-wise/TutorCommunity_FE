const DATABASE = "beewise-material-files";
const STORE = "files";
const ALLOWED = new Set(["pdf", "doc", "docx", "ppt", "pptx"]);

export function validateMaterialFile(file: File): string | null {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED.has(extension)) return "Chỉ hỗ trợ PDF, DOC, DOCX, PPT và PPTX.";
  if (file.size === 0) return "Tệp đang trống. Vui lòng chọn tệp khác.";
  if (file.size > 20 * 1024 * 1024) return "Tệp vượt quá giới hạn 20 MB.";
  return null;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error("Không thể mở bộ nhớ tệp trên trình duyệt."));
  });
}

export async function saveLocalFile(id: string, file: File): Promise<void> {
  const db = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE, "readwrite");
      transaction.objectStore(STORE).put(file, id);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(new Error("Không thể lưu tệp. Kiểm tra dung lượng bộ nhớ trình duyệt."));
      transaction.onabort = () => reject(new Error("Lưu tệp bị gián đoạn."));
    });
  } finally { db.close(); }
}

export async function readLocalFile(id: string): Promise<File | null> {
  const db = await openDatabase();
  try {
    return await new Promise<File | null>((resolve, reject) => {
      const request = db.transaction(STORE, "readonly").objectStore(STORE).get(id);
      request.onsuccess = () => resolve(request.result instanceof File ? request.result : null);
      request.onerror = () => reject(new Error("Không thể đọc tệp tài liệu."));
    });
  } finally { db.close(); }
}
