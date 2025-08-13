import JSZip from "jszip";

export type JsonFileEntry = {
  name: string;
  contents: string | unknown;
  binary: boolean;
};

export type JsonInput = {
  files: JsonFileEntry[];
};

export type ZipResult = {
  blob: Blob;
  added: number;
  skipped: number;
  warnings: string[];
};

// Normalize a relative path and prevent path traversal or absolute paths
export function sanitizeRelativePath(p: string): string | null {
  if (!p || typeof p !== "string") return null;
  // Disallow absolute paths
  if (p.startsWith("/") || /^[a-zA-Z]:\\\\/.test(p)) return null; // windows drive

  // Normalize slashes to forward
  const normalized = p.replace(/\\\\/g, "/");
  // Split and resolve . and ..
  const parts: string[] = [];
  for (const seg of normalized.split("/")) {
    if (!seg || seg === ".") continue;
    if (seg === "..") {
      // trying to traverse up
      if (parts.length === 0) return null;
      parts.pop();
      continue;
    }
    // rudimentary check against weird control characters
    if (/\0/.test(seg)) return null;
    parts.push(seg);
  }
  return parts.join("/");
}

function base64ToUint8Array(b64: string): Uint8Array {
  // Handle URL-safe base64 variants
  const normalized = b64.replace(/-/g, "+").replace(/_/g, "/");
  const binaryString = atob(normalized);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

// Core utility to generate a ZIP from the JSON definition
export async function generateZipFromJson(input: JsonInput): Promise<ZipResult> {
  const zip = new JSZip();
  const warnings: string[] = [];
  let added = 0;
  let skipped = 0;

  const files = Array.isArray(input?.files) ? input.files : [];

  for (const entry of files) {
    if (!entry || typeof entry.name !== "string") {
      console.warn("Skipping invalid entry (missing name):", entry);
      warnings.push("Skipped entry with missing name");
      skipped++;
      continue;
    }

    const safePath = sanitizeRelativePath(entry.name);
    if (!safePath) {
      console.warn("Skipping unsafe path:", entry.name);
      warnings.push(`Skipped unsafe path: ${entry.name}`);
      skipped++;
      continue;
    }

    try {
      if (entry.binary) {
        if (typeof entry.contents !== "string") {
          console.warn(`Binary file ${entry.name} must have base64 string contents`);
          warnings.push(`Binary contents for ${entry.name} not a base64 string`);
          skipped++;
          continue;
        }
        const bytes = base64ToUint8Array(entry.contents);
        zip.file(safePath, bytes, { binary: true });
      } else {
        const contentStr = typeof entry.contents === "string" ? entry.contents : String(entry.contents ?? "");
        zip.file(safePath, contentStr, { binary: false });
      }
      added++;
    } catch (err) {
      console.warn("Failed to add file to zip:", entry.name, err);
      warnings.push(`Failed to add ${entry.name}`);
      skipped++;
    }
  }

  // Even if zero files, JSZip will produce a valid empty zip
  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 9 } });

  return { blob, added, skipped, warnings };
}

export function randomFileName(prefix = "archive"): string {
  const arr = new Uint8Array(6);
  (crypto?.getRandomValues ? crypto.getRandomValues(arr) : arr).forEach(() => {});
  // Fallback if crypto is not available
  const rand = Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
  const suffix = rand || Math.random().toString(36).slice(2, 10);
  return `${prefix}-${suffix.slice(0, 8)}.zip`;
}
