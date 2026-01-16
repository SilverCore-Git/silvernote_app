import { ref } from "vue";
import { messages, type Message } from "../useMessage";

const useResponse = () => {

    const newResponse = ref<Message | null>(null);

    const createNewResponse = () => {
        const response: Message = {
            id: Date.now(),
            role: "assistant",
            content: "",
            timestamp: Date.now(),
        };

        newResponse.value = response;
        messages.value.push(response);
    };

    const updateResponse = (content: string) => {
        if (!newResponse.value) return;
        newResponse.value.content = content;
    };

    return {
        newResponse,
        createNewResponse,
        updateResponse,
    };
    
};

export default useResponse;
