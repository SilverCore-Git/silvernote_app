<script lang="ts" setup>

import { ref } from 'vue';
import { useSignIn } from '@clerk/vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { signIn, isLoaded, setActive } = useSignIn();

const email = ref<string>('');
const password = ref<string>('');
const error = ref<string>('');
const isLoading = ref<boolean>(false);

const handleSubmit = async () => {
    if (!isLoaded.value) return;
    
    error.value = '';
    isLoading.value = true;

    try {

        const result = await signIn.value?.create({
            identifier: email.value,
            password: password.value,
        })

        if (result?.status === 'complete' && setActive.value) {
            await setActive.value({ session: result.createdSessionId });
            router.push('/');
        } else {
            console.log('Statut de connexion:', result?.status);
        }

    } catch (err: any) {
        console.error('Erreur de connexion:', err);
        error.value = err.errors?.[0]?.message || 'Erreur lors de la connexion';
    } finally {
        isLoading.value = false;
    }
}

const handleOAuth = async (provider: 'google' | 'discord') => {
    if (!isLoaded.value) return;
    
    try {
        await signIn.value?.authenticateWithRedirect({
            strategy: `oauth_${provider}`,
            redirectUrl: '/sso-callback',
            redirectUrlComplete: '/'
        });
    } catch (err: any) {
        console.error(`Erreur OAuth ${provider}:`, err);
        error.value = err.errors?.[0]?.message || `Erreur lors de la connexion avec ${provider}`;
    }
}

</script>

<template>
    
            <div 
                class="
                    relative z-10 bg-[var(--bg2)] rounded-2xl shadow-lg 
                    p-8 w-full max-w-md
                "
            >

                <header class="text-center mb-6">

                    <img 
                        src="/favicon.svg"
                        class="w-15 h-15 mx-auto mb-2"
                    />
                    
                    <h2 class="text-2xl font-bold">Se connecter a Silvernote</h2>

                    <span>Content de te revoir, connecte toi pour continuer !</span>

                </header>

                
                <div 
                    v-if="error" 
                    class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm"
                >
                    {{ error }}
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-4">
                        
                    <div>

                        <label for="email" class="block text-sm font-medium">
                            Email ou nom d'utilisateur
                        </label>

                        <input 
                            type="text" 
                            id="email" 
                            v-model="email"
                            placeholder="email@example.com ou pseudo"
                            required
                            :disabled="isLoading"
                            class="
                                mt-1 block w-full px-4 py-2 border border-gray-300 
                                rounded-lg focus:ring-[var(--btn)] focus:border-[var(--btn)] 
                                outline-none disabled:opacity-50
                            "
                        />

                    </div>

                    <div>

                        <label 
                            for="password" 
                            class="block text-sm font-medium"
                        >
                            Mot de passe
                        </label>

                        <input 
                            type="password" 
                            id="password" 
                            v-model="password"
                            placeholder="••••••••"
                            required
                            :disabled="isLoading"
                            class="
                                mt-1 block w-full px-4 py-2 border border-gray-300 
                                rounded-lg focus:ring-[var(--btn)] focus:border-[var(--btn)] 
                                outline-none disabled:opacity-50
                            "
                        />

                    </div>

                    <button
                        type="submit"
                        :disabled="isLoading || !isLoaded"
                        class="w-full primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {{ isLoading ? 'Connexion...' : 'Se connecter' }}
                    </button>

                </form>

                <div class="my-4 flex items-center">
                    <hr class="flex-grow border-gray-300" />
                    <span class="px-2 text-sm">ou</span>
                    <hr class="flex-grow border-gray-300" />
                </div>

                <div class="space-y-3">

                    <button
                        @click="handleOAuth('google')"
                        :disabled="isLoading || !isLoaded"
                        class="second w-full"
                    >
                        <img 
                            src="./assets/icon/google.svg" 
                            class="w-5 h-5 mr-2"
                        />
                        Se connecter avec Google
                    </button>

                    <button
                        @click="handleOAuth('discord')"
                        :disabled="isLoading || !isLoaded"
                        class="second w-full"
                    >
                        <img 
                            src="./assets/icon/discord.svg" 
                            class="w-5 h-5 mr-2"
                        />
                        Se connecter avec Discord
                    </button>

                </div>

                <p class="text-sm text-center mt-6 ">
                    Pas de compte ? 
                    <a 
                        class="ml-2 font-bold px-1"
                        @click="router.push({ query: { form: 'signup' } })"
                    >
                        s'inscrire
                    </a>
                </p>

            </div>

</template>

