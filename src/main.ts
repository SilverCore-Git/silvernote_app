import { createApp } from 'vue';
import App from './App.vue';
import router from './router.ts';
import FloatingVue from 'floating-vue';
import { clerkPlugin } from '@clerk/vue';
import pkg from '../package.json' assert { type: 'json' };


import './style.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import postError from './components/errorOverlay/postError.ts';

const PUBLISHABLE_KEY = pkg.dev
  ? import.meta.env.VITE_CLERK_TEST_PUBLISHABLE_KEY
  : import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

const app = createApp(App)

if (pkg.dev)
{
  app.config.errorHandler = (err, instance, info) => {
    postError({
      raw: err,
      place: info,
      error: "500",
      more: (instance as any)?.type?.name
        ? `Component: ${(instance as any).type.name}`
        : "Unknown component",
    });
  };
}

app.use(clerkPlugin, { publishableKey: PUBLISHABLE_KEY });
app.use(FloatingVue);

app.use(router);
app.mount('#app');