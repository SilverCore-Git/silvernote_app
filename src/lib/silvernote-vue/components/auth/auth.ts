import { ref } from "vue";
import { useRoute } from "vue-router";

const error = ref<string>('');
const isLoading = ref<undefined | 'discord' | 'google' | 'snote'>(undefined);
const route = useRoute();

const handleOAuth = async (provider: 'google' | 'discord', isLoaded: boolean, sign: any) => {
    if (!isLoaded) return;
    isLoading.value = provider;
    
    try {
        console.log('Connecting with sso')
        await sign.authenticateWithRedirect({
            strategy: `oauth_${provider}`,
            redirectUrl: '/auth/sso-callback',
            redirectUrlComplete: route?.query.redirectUrl || '/'
        });
    } catch (err: any) {
        console.error(`Erreur OAuth ${provider}:`, err);
        isLoading.value = undefined;
        error.value = err.errors?.[0]?.message || `Erreur lors de la connexion avec ${provider}`;
    }
}

export {
    handleOAuth,
    error,
    isLoading
}