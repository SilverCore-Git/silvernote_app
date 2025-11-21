import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import isMobile from "@/assets/ts/utils/isMobile";

const error = ref<string>('');
const isLoading = ref<undefined | 'discord' | 'google' | 'snote'>(undefined);
const route = useRoute();
const router = useRouter();

const handleOAuth = async (provider: 'google' | 'discord', isLoaded: boolean, sign: any, clerk: any) => {

    if (!isLoaded) {
        console.warn('Clerk not loaded yet');
        return;
    }
    
    isLoading.value = provider;
    error.value = '';
    
    try {
        console.log('Starting OAuth with:', provider);
        
        const width = 500;
        const height = 600;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;
        
        const origin = window.location.origin;
        const redirectUrl = `${origin}/auth/sso-callback`;
        const redirectUrlComplete = route?.query?.redirectUrl || '/';
        
        console.log('Redirect URLs:', {
            redirectUrl,
            redirectUrlComplete
        });
        
        if (!isMobile)
        {
            const popup = window.open(
                '',
                `OAuth ${provider}`,
                `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
            );
            
            if (!popup) {
                throw new Error('La popup a été bloquée. Veuillez autoriser les popups pour ce site.');
            }

            await sign.authenticateWithPopup({
                popup,
                strategy: `oauth_${provider}`,
                redirectUrl,
                redirectUrlComplete,
            });
        }
        else
        {
            await sign.authenticateWithRedirect({
                strategy: `oauth_${provider}`,
                redirectUrl,
                redirectUrlComplete,
            });
        }
        
        
        console.log('OAuth authentication completed');
        
        if (sign.status === 'complete') {
            console.log('Sign process complete');
            
            if (sign.createdSessionId) {
                await clerk.setActive({ 
                    session: sign.createdSessionId 
                });
            }
                
            const redirectUrl = route.query.redirectUrl as string;

            if (!redirectUrl) {
                router.push('/');
                return;
            }

            const url = new URL(redirectUrl);
            url.searchParams.set('utm_source', 'silvernote-auth');
            window.location.href = url.toString();
            
        }
        
    } catch (err: any) {
        console.error(`OAuth ${provider} error:`, err);
        error.value = err.errors?.[0]?.message || err.message || `Erreur lors de la connexion avec ${provider}`;
    } finally {
        isLoading.value = undefined;
    }
}

export {
    handleOAuth,
    error,
    isLoading
}