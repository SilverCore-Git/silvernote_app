import { ref, watch, readonly } from "vue";

const token = ref<string | undefined>(undefined);
const isReady = ref(false);

let resolveInit: () => void;
let readyPromise: Promise<void>;

let refreshInterval: ReturnType<typeof setInterval> | undefined;

function resetReadyPromise() {
  readyPromise = new Promise<void>((resolve) => {
    resolveInit = resolve;
  });
}

resetReadyPromise();

export function initTokenService({ isLoaded, isSignedIn, session }: any) {

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

  const autoRefreshToken = () => {
    if (refreshInterval) clearInterval(refreshInterval);

    refreshInterval = setInterval(async () => {
      if (session.value) {
        await refresh();
      }
    }, 600000);
  };

  resetReadyPromise();
  isReady.value = false;

  watch(
    () => session.value,
    async (newSession) => {
      if (newSession) {
        await refresh();
        autoRefreshToken();
      } else {
        token.value = undefined;
        if (refreshInterval) clearInterval(refreshInterval);
      }
    },
    { deep: true }
  );

  watch(
    isLoaded,
    async (loaded) => {
      if (loaded) {
        await refresh();
        autoRefreshToken();
        resolveInit();
      }
    },
    { immediate: true }
  );

  watch(
    isSignedIn,
    async (signedIn) => {
      if (signedIn) {
        await refresh();
        autoRefreshToken();
      } else {
        token.value = undefined;
        if (refreshInterval) clearInterval(refreshInterval);
      }
    }
  );

  return { refresh };
}


export async function getFreshToken(session: any) {
  if (!session?.value) return undefined;
  try {
    return await session.value.getToken();
  } catch (e) {
    console.error("Erreur getToken:", e);
    return undefined;
  }
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
