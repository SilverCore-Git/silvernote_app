<template>

  <header>

    <SignedOut class="flex justify-center items-center flex-row">

      <SignInButton>

        <button 
            v-if="login || true" 
            class="second mr-4"
        >
            Se connecter
        </button>
        
      </SignInButton>

      <SignUpButton>

        <button 
            v-if="register || true"
            class="primary"
        >
            S'inscrire
        </button>

      </SignUpButton>

    </SignedOut>

    <SignedIn class="flex items-center">

      <div 
        @click="user_dropdown = !user_dropdown"
        v-if="user_icon" 
        :style="{
          backgroundImage: `url(${user_icon})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }" 
        class="w-8 h-8 rounded-full cursor-pointer border-[var(--btn)]
               hover:border-2 transition-all duration-100"
      ></div>
        
    </SignedIn>


  </header>

  <div v-if="user_dropdown" @click="user_dropdown = false" class=" absolute inset-0 w-screen h-screen z-10"></div>

  <div v-if="user_dropdown" class="z-50 absolute top-20 right-[5%] w-60 rounded-2xl bg-[var(--bg2)]">

      <div class="p-4 border-b flex-row flex justify-between">

        <div>
          <div class="text-sm font-semibold text-gray-800">{{ user?.fullName }}</div>
          <div class="text-sm text-gray-500">{{ user?.username }}</div>
        </div>

        <div 
          v-if="user_icon" 
          :style="{
            backgroundImage: `url(${user_icon})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }" 
          class="w-8 h-8 rounded-full"
        ></div>

      </div>

      <ul class="divide-y text-sm">

        <li>
          <button @click="router.push('/user/profile')" class="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-2 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m0 14v1m8-8h1m-14 0H4m16.95-4.95l-.707.707M6.343 17.657l-.707.707M17.657 17.657l.707.707M6.343 6.343l.707.707"/>
            </svg>
            Mon compte
          </button>
        </li>

        <li>
          <SignOutButton>
            <button class="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-2xl flex items-center gap-2 cursor-pointer text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7"/>
              </svg>
              Se déconnecter
            </button>
          </SignOutButton>
        </li>

      </ul>    

  </div>

</template>

<script setup lang="ts">

    import { SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton, useUser } from '@clerk/vue'
    import { onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';

    const { user, isLoaded } = useUser();

    const user_icon = ref<string | undefined>('');
    const user_dropdown = ref<boolean>(false);
    const router = useRouter();

    onMounted(() => {
      const interval = setInterval(async () => {
        if (isLoaded) {
          user_icon.value = user.value?.imageUrl;
          clearInterval(interval)
        }
      }, 1000)
    })

    defineProps<{
        register?: boolean;
        login?: boolean;
    }>()

</script>