import { sendMessage } from "./useMessage"
import { isOpen } from "../assets/const"

const useSilverIA = () => {

    const sendToSilverIA = ({ text, route }: { text: string, route: any }) => {

        isOpen.value = true;
        sendMessage({ text, route });
    }

    return {
        sendToSilverIA
    }

}

export default useSilverIA;