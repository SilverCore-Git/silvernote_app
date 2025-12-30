import { onMounted, ref } from 'vue';

const token = ref<string>('loading');

const refresh = async () => {
  token.value = await window.Clerk.session?.getToken() || 'undefined';
};

onMounted(async () => {
  await refresh();
})

export async function useToken() {

  await refresh();

  (async () => {
    setInterval(async () => {
      await refresh();
    }, 1 * 60 * 60 * 1000);
  })();

  return {
    token,
    refresh,
  };

}
