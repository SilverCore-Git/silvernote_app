import { MAX_FILE_SIZE } from ".";

export default async function 
(
  file: File,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal
): Promise<string>
{

    // Validate file
    if (!file) {
        throw new Error("No file provided")
    }
    if (file.size > MAX_FILE_SIZE) {
        throw new Error(
            `File size exceeds maximum allowed (${MAX_FILE_SIZE / (1024 * 1024)}MB)`
        )
    }


    for (let progress = 0; progress <= 100; progress += 10) {
        if (abortSignal?.aborted) {
        throw new Error("Upload cancelled")
        }
        await new Promise((resolve) => setTimeout(resolve, 500))
        onProgress?.({ progress })
    }

    return "/images/tiptap-ui-placeholder-image.jpg"
}