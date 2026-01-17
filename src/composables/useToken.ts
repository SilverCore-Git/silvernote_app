import { ref, watch, readonly } from 'vue';

const token = ref<string | undefined>(undefined);
const isReady = ref(false);

let resolveInit: () => void;
const readyPromise = new Promise<void>((resolve) => {
  resolveInit = resolve;
});

export function initTokenService
({ isLoaded, isSignedIn, session }: any)
{

  const refresh = async () => {
    try {
      if (session.value) {
        token.value = await session.value.getToken();
      } else {
        token.value = undefined;
      }
    } catch (e) {
      console.error("Erreur lors de la récupération du token:", e);
      token.value = undefined;
    } finally {
      isReady.value = true;
    }
  };

  watch(() => session.value, async (newSession) => {
    if (newSession) {
      await refresh();
    } else {
      token.value = undefined;
    }
  }, { deep: true });

  watch(isLoaded, async (loaded) => {
    if (loaded) {
      await refresh();
      resolveInit();
    }
  }, { immediate: true });

  watch(isSignedIn, async (signedIn) => {
    if (signedIn) {
      await refresh();
    } else {
      token.value = undefined;
    }
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