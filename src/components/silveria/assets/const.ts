import { nextTick, ref } from "vue";

const isOpen = ref<boolean>(false);
const isMaximised = ref<boolean>(false);
const chatBody = ref<HTMLElement | null>(null);
const isLoading = ref<boolean>(false);

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) setTimeout(scrollToBottom, 100);
};

const toggleMaximise = () => {
  isMaximised.value = !isMaximised.value;
};

const scrollToBottom = async () => {
    await nextTick();
    if (chatBody.value) {
        chatBody.value.scrollTop = chatBody.value.scrollHeight;
    }
};


export {
    isOpen,
    isMaximised,
    chatBody,
    isLoading,
    toggleChat,
    toggleMaximise,
    scrollToBottom
};