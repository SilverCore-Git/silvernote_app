import { createApp } from 'vue';
import App from './App.vue';
import router from './router.ts';
import FloatingVue from 'floating-vue';
import { clerkPlugin } from '@clerk/vue';
import pkg from '../package.json' assert { type: 'json' };


import './style.css';

const PUBLISHABLE_KEY = pkg.dev
  ? import.meta.env.VITE_CLERK_TEST_PUBLISHABLE_KEY
  : import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

const app = createApp(App)

app.use(clerkPlugin, { publishableKey: PUBLISHABLE_KEY });
app.use(FloatingVue);

app.use(router);
app.mount('#app');