import { createRouter, createWebHistory } from 'vue-router';

import Home from './views/Home.vue';
import Politic from './views/Politique_de_confidentialite.vue';
import Download from './views/Download.vue';

const routes = [
  { 
    path: '/', 
    name: 'Home', 
    component: Home,
    props: {},
    meta: { title: 'SilverNote : vos notes partout !' }
  },
  { 
    path: '/politique-de-confidentialite', 
    name: 'politique-de-confidentialite', 
    component: Politic,
    props: {},
    meta: { title: 'SilverNote - confidentialité' }
  },
  { 
    path: '/download', 
    name: 'download', 
    component: Download,
    props: {},
    meta: { title: 'SilverNote - download' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, _from, next) => {
  const title = to.meta.title as string;

  if (title) {
    document.title = title;

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:title');
      meta.setAttribute('content', title);
      document.head.appendChild(meta);
    }
  }

  next();
});


export default router