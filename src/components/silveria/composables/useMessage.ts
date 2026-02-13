import { ref } from "vue";
import { isLoading, scrollToBottom } from "../assets/const";
import sendToSilverIA from "./useSilveriaAPI/sendToSilverIA";
import useChat from "./useSilveriaAPI/useChat";
import { tools } from "./useSilveriaAPI/useTools";
import { reload_list } from "@/views/Home/composables/Reload";

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  error?: string;
  isThinking?: boolean;
  activeTool?: string | null;
};

const userInput = ref<string>('');
const messages = ref<Message[]>([]);


const sendMessage = async ({ 
    text = userInput.value, 
    route
}: { text?: string, route?: any } = {}) => {

    const content = text?.trim();
    
    if (!content || isLoading.value) return;

    messages.value.push({
        id: Date.now(),
        role: 'user',
        content: content,
        timestamp: Date.now()
    });

    userInput.value = '';
    isLoading.value = true;
    await scrollToBottom();

    const assistantMsgId = Date.now() + 1;
    const assistantMessageIndex = messages.value.push({
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        isThinking: true
    }) - 1;

    try {

        await sendToSilverIA({

            message: content,
            note: route?.params.uuid as string || undefined,
            uuid: useChat.chat.value?.uuid || '',
            messageID: assistantMsgId,
            model: 'gpt',
            
            onToken: (token) => {
                if (messages.value[assistantMessageIndex].isThinking) {
                   messages.value[assistantMessageIndex].isThinking = false;
                }
                messages.value[assistantMessageIndex].content += token;
                scrollToBottom();
            },

            onComplete: () => {
                messages.value[assistantMessageIndex].isThinking = false;
                console.log("Réponse terminée");
                if (tools.value.length > 0)
                {
                    reload_list('cloud');
                }
            },

            onError: (err) => {
                //messages.value[assistantMessageIndex].content += "\n\n*Une erreur est survenue lors de la génération.*";
                messages.value[assistantMessageIndex].error = err;
                console.error("Erreur SilverIA:", err);
            }

        });

    } catch (e) {
        console.error(e);
        messages.value[assistantMessageIndex].content = "Erreur de connexion.";
    } finally {
        isLoading.value = false;
        await scrollToBottom();
    }
};

export {
    type Message,
    userInput,
    messages,
    sendMessage
}