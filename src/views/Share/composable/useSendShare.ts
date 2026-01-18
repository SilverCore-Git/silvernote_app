import { ref } from "vue";

export default
function useShare() {
    
    const shareURL = ref<string>('');
    const send_text = ref<string>('');
    const uuid = ref<string>('');
    const isSuccess = ref<boolean>(false);
    const successMessage = ref<string>('');

    function initUseShare(shareUUID: string) {
        uuid.value = shareUUID;
        shareURL.value = `https://app.silvernote.fr/share/${shareUUID}`;
        send_text.value = `Je te partage ma note :\n${shareURL.value}`;
    }

    async function sendShare() {

        if (navigator.share) {

            try {

                await navigator.share({
                    title: "Je te partage ma note !",
                    text: send_text.value,
                    url: shareURL.value,
                });

            } catch (err) {

                if ((err as Error).name !== 'AbortError') {
                    console.error("Erreur de partage :", err);
                }

            }

        } else {

            try {
                await navigator.clipboard.writeText(shareURL.value);
                triggerSuccess('Lien de partage copié !');
            } catch (err) {
                console.error("Échec de la copie :", err);
            }

        }
    }

    function triggerSuccess(msg: string) {
        successMessage.value = msg;
        isSuccess.value = true;
        setTimeout(() => {
            isSuccess.value = false;
        }, 6000);
    }

    return {
        uuid,
        shareURL,
        send_text,
        isSuccess,
        successMessage,
        initUseShare,
        sendShare
    };

}