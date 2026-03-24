import { onBeforeUnmount, onMounted } from "vue";
import { editor } from "../Editor";
import { useUser } from "@clerk/vue";
import waitFor from "@/assets/ts/utils/waitFor";

const initWordCounter = () => {

    const { user } = useUser();
    let oldWordCount: number = 0;

    onMounted(async () => {
        await waitFor(() => editor.value !== undefined);
        oldWordCount = editor.value?.storage.characterCount.words() || 0;
    });

    onBeforeUnmount(async () => {

        if (!editor.value || !user.value) return;

        const currentWordCount = editor.value.storage.characterCount.words();
        const difference = currentWordCount - oldWordCount;

        if (difference === 0) return;

        const metadata = (user.value.unsafeMetadata as any) || {};
        const snoteWrapped = metadata.snoteWrapped || { wordCount: 0 };
        
        const newTotal = (snoteWrapped.wordCount || 0) + difference;

        try {
            
            await user.value.update({
                unsafeMetadata: {
                    ...metadata,
                    snoteWrapped: {
                        ...snoteWrapped,
                        wordCount: newTotal
                    }
                }
            });

            console.log(`WordCount mis à jour : +${difference} mots (Total: ${newTotal})`);

        } 
        catch (err) 
        {
            console.error("Erreur lors de la mise à jour du WordCount Clerk:", err);
        }

    });
    
};

export { initWordCounter };