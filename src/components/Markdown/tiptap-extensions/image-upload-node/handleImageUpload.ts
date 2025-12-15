import { api_url } from "@/assets/ts/backend_link";
import { MAX_FILE_SIZE } from ".";

export default function 
(
  file: File,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal
): Promise<string>
{
        
    return new Promise((resolve, reject) => {

        if (!file) return reject(new Error("No file provided"));
        if (file.size > MAX_FILE_SIZE)
        return reject(
            new Error(`File size exceeds maximum allowed (${MAX_FILE_SIZE / (1024 * 1024)}MB)`)
        );

        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
                const percent = Math.round((event.loaded / event.total) * 100);
                onProgress({ progress: percent });
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText).url);
            } else {
                reject(new Error(`Upload failed with status ${xhr.status}`));
            }
        };

        xhr.onerror = () => reject(new Error("Upload failed"));

        if (abortSignal) {
            abortSignal.addEventListener("abort", () => xhr.abort());
        }

        const formData = new FormData();
        formData.append("file", file);

        xhr.open("POST", `${api_url}/api/db/image/upload`);
        xhr.send(formData);

    });
}
