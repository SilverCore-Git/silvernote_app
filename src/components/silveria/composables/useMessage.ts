import { ref } from "vue";
import { isLoading, scrollToBottom } from "../assets/const";

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

const userInput = ref<string>('');
const messages = ref<Message[]>([]);

const sendMessage = async (text: string = userInput.value) => {

    const content = text.trim();
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

    try {
        // Simulation API
        await new Promise(r => setTimeout(r, 1500));
        
        messages.value.push({
        id: Date.now() + 1,
        role: 'assistant',
        content: "Voici un exemple de **Markdown** :\n\n- Point 1\n- Point 2\n\n```js\nconsole.log('Ceci est bien formaté');\n```",
        timestamp: Date.now()
        });
    } catch (e) {
        console.error(e);
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