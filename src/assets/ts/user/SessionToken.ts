import { onMounted, ref } from "vue";


const sessionToken = ref<string>('');

const refrechToken = async () => {
    sessionToken.value = await window.Clerk?.session?.getToken() ?? '';
}

onMounted(async() => {
  await refrechToken();
  
  setInterval(async () => {
    await refrechToken();
  }, 1 * 3600 * 1000); // all houre
})

export default sessionToken;