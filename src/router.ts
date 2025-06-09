import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue';
import Edit from './views/Edit.vue';
import Settings from './views/Settings.vue';
import Account from './views/Account.vue';

const routes = [
  { 
    path: '/', 
    name: 'Home', 
    component: Home,
    props: {},
    meta: { title: 'SilverNote - Home' }
  },
  { 
    path: '/edit', 
    name: 'Edit', 
    component: Edit,
    props: {},
    meta: { title: 'SilverNote - Edit' }
  },
  { 
    path: '/settings', 
    name: 'Settings', 
    component: Settings,
    props: {},
    meta: { title: 'SilverNote - Settings' }
  },
  { 
    path: '/account', 
    name: 'Account', 
    component: Account,
    props: {},
    meta: { title: 'SilverNote - Account' }
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
