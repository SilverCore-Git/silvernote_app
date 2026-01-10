import { ref, watch, readonly } from 'vue';

const token = ref<string | null>(null);
const isReady = ref(false);
let resolveInit: () => void;
const readyPromise = new Promise<void>((resolve) => {
  resolveInit = resolve;
});


export function initTokenService({ isLoaded, isSignedIn, session }: any) {

  const refresh = async () => {

    if (session.value) {
      token.value = await session.value.getToken();
    } else {
      token.value = null;
    }
    isReady.value = true;
  };

  watch(isLoaded, async (loaded) => {
    if (loaded) {
      await refresh();
      resolveInit();
    }
  }, { immediate: true });

  watch(isSignedIn, async () => {
    await refresh();
  });

  return { refresh };
}


export function useToken() {
  const waitUntilReady = async () => {
    await readyPromise;
    return token.value;
  };

  return {
    token: readonly(token),
    isReady: readonly(isReady),
    waitUntilReady
  };
}