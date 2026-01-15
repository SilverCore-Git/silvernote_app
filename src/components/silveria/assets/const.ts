import { nextTick, ref, watch } from "vue";
import { userInput } from "../composables/useMessage";

const isOpen = ref<boolean>(false);
const isMaximised = ref<boolean>(false);
const chatBody = ref<HTMLElement | null>(null);
const isLoading = ref<boolean>(false);
const isUserInputMaximised = ref<'no' | 'can' | 'yes'>('no');
watch(() => userInput.value, () => { 
  if (userInput.value.length > 2*90) isUserInputMaximised.value = 'can';
})

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) setTimeout(scrollToBottom, 100);
};

const toggleMaximise = () => {
  isMaximised.value = !isMaximised.value;
};

const toggleUserInputMaximise = () => {
  isUserInputMaximised.value =
    isUserInputMaximised.value == 'yes'
      ? 'no'
      : 'yes'
  
  if (
    userInput.value.length > 2*90 
    &&
    isUserInputMaximised.value !== 'yes'
  ) isUserInputMaximised.value = 'can';
}

const scrollToBottom = async () => {
    await nextTick();
    if (chatBody.value) {
        chatBody.value.scrollTop = chatBody.value.scrollHeight;
    }
};


export {
    isOpen,
    isMaximised,
    isUserInputMaximised,
    chatBody,
    isLoading,
    toggleChat,
    toggleMaximise,
    scrollToBottom,
    toggleUserInputMaximise
};