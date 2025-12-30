import { api_url } from "@/assets/ts/backend_link";
import { ref } from "vue";

interface News {
    title?: string;
    message?: string;
    btn?: boolean;
    href?: string;
    active: boolean;
}

const news = ref<News>({ active: false });
const news_loaded = ref<boolean>(false);

const useNews = () => {

    try {

        fetch(`${api_url}/api/get_news`).then(res => res.json())
            .then(res => {
                if (res == false) news.value.active = false;
                else news.value = { ...res, active: true };
            })


    }
    catch(err) {
        console.error('An error occured on news var : ', err);
    }
    finally {
        news_loaded.value = true;
    }

    return {
        news,
        news_loaded
    }

}

export {
    useNews
}

export type {
    News
}