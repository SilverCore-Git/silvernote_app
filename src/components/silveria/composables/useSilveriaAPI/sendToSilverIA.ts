import { api_url } from "@/assets/ts/backend_link";
import { useToken } from "@/composables/useToken";
import { useTools } from "./useTools"; 

const { addTool, addToolResult, failTool } = useTools();

interface SendStreamOptions {
    uuid: string;
    message: string;
    messageID: number;
    note?: string;
    model?: 'gpt' | 'gemini';
    onToken: (token: string) => void;
    onComplete: () => void;
    onError: (error: string) => void;
}

export async function sendMessageStream({
    uuid,
    message,
    messageID,
    note,
    model = 'gpt',
    onToken,
    onComplete,
    onError
}: SendStreamOptions): Promise<void>
{

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
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;

            const lines = buffer.split("\n\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
                const trimmedLine = line.trim();
                if (!trimmedLine.startsWith("data: ")) continue;

                const data = trimmedLine.slice(6);
                const parsedData = JSON.parse(data);
                const type = parsedData.type;
                const content = parsedData.content;

                if (type === "done") {
                    onComplete();
                    return;
                }

                else if (type === "tool_execution") {
                    const tools = parsedData.tools;

                    for (const tool of tools) {
                        addTool({
                            name: tool,
                            id: messageID + "-" + tool
                        });
                    }
                }

                else if (type === "tool_result") {
                    const tool = parsedData.tool;
                    const toolId = messageID + "-" + tool;

                    if (content.startsWith('Error')) {
                        failTool(toolId, content);
                    } else {
                        addToolResult(toolId);
                    }
                }

                else if (type === "error") {
                    onError(content);
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
