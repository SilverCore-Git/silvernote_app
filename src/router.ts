import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';

import Home from './views/Home.vue';
import Edit from './views/Edit.vue';
import Settings from './views/Settings.vue';
import Account from './views/Account.vue';
import Dev from './views/Dev.vue';
import Components from './views/utils/Components.vue';

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
  },
  { 
    path: '/dev', 
    name: 'dev', 
    component: Dev,
    props: {},
    meta: { title: 'SilverNote - dev access' }
  },
  { 
    path: '/dev/component/:component', 
    name: 'dev component view', 
    component: Components,
    props: {},
    meta: { title: 'SilverNote - dev component view' }
  }
]

const isFileProtocol = window.location.protocol === 'file:'

const router = createRouter({
  history: isFileProtocol
    ? createWebHashHistory(import.meta.env.BASE_URL)  // pour Electron local
    : createWebHistory(import.meta.env.BASE_URL),    // pour Web/Express
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
