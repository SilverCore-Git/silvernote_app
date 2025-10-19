<script setup>

import { ref } from 'vue'
import { useSignUp } from '@clerk/vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { signUp, isLoaded, setActive } = useSignUp()

const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const pendingVerification = ref(false)
const code = ref('')

const handleSubmit = async () => {
    if (!isLoaded.value) return
    
    error.value = ''
    isLoading.value = true

    try {
        
        await signUp.value.create({
            emailAddress: email.value,
            password: password.value,
            username: username.value,
        })

        await signUp.value.prepareEmailAddressVerification({ 
            strategy: 'email_code' 
        })

        pendingVerification.value = true

    } catch (err) {
        console.error('Erreur lors de l\'inscription:', err)
        error.value = err.errors?.[0]?.message || 'Erreur lors de la création du compte'
    } finally {
        isLoading.value = false
    }
}

const handleVerification = async () => {
    if (!isLoaded.value) return
    
    error.value = ''
    isLoading.value = true

    try {

        // Vérifier le code email
        const completeSignUp = await signUp.value.attemptEmailAddressVerification({
            code: code.value,
        })

        if (completeSignUp.status === 'complete') {
            await setActive({ session: completeSignUp.createdSessionId })
            router.push('/') // Redirection après inscription réussie
        } else {
            console.log('Statut d\'inscription:', completeSignUp.status)
        }

    } catch (err) {
        console.error('Erreur de vérification:', err)
        error.value = err.errors?.[0]?.message || 'Code de vérification invalide'
    } finally {
        isLoading.value = false
    }
}

const handleOAuth = async (provider) => {
    if (!isLoaded.value) return
    
    try {
        await signUp.value.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/'
        })
    } catch (err) {
        console.error(`Erreur OAuth ${provider}:`, err)
        error.value = err.errors?.[0]?.message || `Erreur lors de l'inscription avec ${provider}`
    }
}

</script>

<template>

            <div class="relative z-10 bg-[var(--bg2)] rounded-2xl shadow-lg p-8 w-full max-w-md">
                
                <header class="text-center mb-6">

                    <img 
                        src="/favicon.svg"
                        class="w-15 h-15 mx-auto mb-2"
                        alt="Logo"
                    />

                    <h2 class="text-2xl font-bold">
                        {{ pendingVerification ? 'Vérifie ton email' : 'Créer ton compte' }}
                    </h2>

                </header>

                
                <div 
                    v-if="error" 
                    class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm"
                >
                    {{ error }}
                </div>

                <form 
                    v-if="pendingVerification" 
                    @submit.prevent="handleVerification" 
                    class="space-y-4"
                >

                    <p class="text-sm text-gray-600 mb-4">
                        Un code de vérification a été envoyé à <strong>{{ email }}</strong>
                    </p>
                    
                    <div>
                        <label for="code" class="block text-sm font-medium">
                            Code de vérification
                        </label>
                        <input 
                            type="text" 
                            id="code" 
                            v-model="code"
                            placeholder="123456"
                            required
                            :disabled="isLoading"
                            maxlength="6"
                            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[var(--btn)] focus:border-[var(--btn)] outline-none disabled:opacity-50"
                        />
                    </div>

                    <button
                        type="submit"
                        :disabled="isLoading || !isLoaded"
                        class="w-full primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {{ isLoading ? 'Vérification...' : 'Vérifier' }}
                    </button>
                    
                </form>

                <form 
                    v-else 
                    @submit.prevent="handleSubmit" 
                    class="space-y-4"
                >

                    <div>
                        <label for="username" class="block text-sm font-medium">
                            Nom d'utilisateur
                        </label>
                        <input 
                            type="text" 
                            id="username" 
                            v-model="username"
                            placeholder="PatricLeBG"
                            required
                            :disabled="isLoading"
                            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[var(--btn)] focus:border-[var(--btn)] outline-none disabled:opacity-50"
                        />
                    </div>
                        
                    <div>
                        <label for="email" class="block text-sm font-medium">
                            Email
                        </label>
                        <input 
                            type="email" 
                            id="email" 
                            v-model="email"
                            placeholder="email@example.com"
                            required
                            :disabled="isLoading"
                            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[var(--btn)] focus:border-[var(--btn)] outline-none disabled:opacity-50"
                        />
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium">
                            Mot de passe
                        </label>

                        <input 
                            type="password" 
                            id="password" 
                            v-model="password"
                            placeholder="••••••••"
                            required
                            :disabled="isLoading"
                            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[var(--btn)] focus:border-[var(--btn)] outline-none disabled:opacity-50"
                        />
                    </div>

                    <button
                        type="submit"
                        :disabled="isLoading || !isLoaded"
                        class="w-full primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {{ isLoading ? 'Création...' : 'Créer mon compte' }}
                    </button>

                </form>

                <template v-if="!pendingVerification">
                        
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
                            alt="Google"
                        />
                            S'enregistrer avec Google
                        </button>

                        <button
                            @click="handleOAuth('discord')"
                            :disabled="isLoading || !isLoaded"
                            class="second w-full"
                        >
                        <img 
                            src="./assets/icon/discord.svg" 
                            class="w-5 h-5 mr-2"
                            alt="Discord"
                        />
                            S'enregistrer avec Discord
                        </button>

                    </div>

                    <p class="text-sm text-center mt-6">
                            Tu as déjà un compte ? 
                        <a 
                            class="ml-2 font-bold px-1 cursor-pointer hover:underline"
                            @click="router.push('/?form=signin')"
                        >
                            se connecter
                        </a>
                    </p>
                    
                </template>

            </div>

</template>
