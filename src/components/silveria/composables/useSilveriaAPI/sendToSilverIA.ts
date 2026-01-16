import { api_url } from "@/assets/ts/backend_link";
import { useToken } from "@/composables/useToken";

interface SendStreamOptions {
    uuid: string;
    message: string;
    note?: string;
    model?: 'gpt' | 'gemini';
    onToken: (token: string) => void;      // called on token recept
    onToolUpdate?: (info: string) => void; // called on tool use
    onComplete: () => void;                // called on end
    onError: (error: string) => void;      // called on error
}

export async function sendMessageStream({
    uuid,
    message,
    note,
    model = 'gpt',
    onToken,
    onToolUpdate,
    onComplete,
    onError
}: SendStreamOptions): Promise<void> {

    try {

        const response = await fetch(`${api_url}/api/ai/send?model=${model}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${useToken().token.value}`
            },
            body: JSON.stringify({ uuid, message, note }),
        });

        if (!response.ok || !response.body) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        while (true) {

            const { done, value } = await reader.read();
            
            if (done) {
                break;
            }

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;

            const lines = buffer.split("\n\n");

            buffer = lines.pop() || "";

            for (const line of lines) {

                const trimmedLine = line.trim();
                
                if (!trimmedLine.startsWith("data: ")) continue;

                const content = trimmedLine.slice(6);
                
                if (content === "[DONE]") {
                    onComplete();
                    return; 
                }
                else if (content.startsWith("[TOOLS:")) {
                    if (onToolUpdate) {
                        const toolsName = content.replace("[TOOLS:", "").replace("]", "");
                        onToolUpdate(toolsName);
                    }
                }
                else if (content.startsWith("[TOOL_RESULT:")) {
                    console.log("Résultat outil reçu:", content);
                }
                else {
                    onToken(content);
                }
            }
        }

    } catch (err: any) {
        console.error("Erreur stream:", err);
        onError(err.message || "Une erreur est survenue");
    }

}

export default sendMessageStream;