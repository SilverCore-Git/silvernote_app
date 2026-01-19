import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';

import Home from './views/Home/Home.vue';
import Edit from './views/Edit/Edit.vue';
import Settings from './views/Settings/Settings.vue';
import Share from './views/Share/Share.vue';
import SignIn from './views/auth/SignIn.vue';
import SignUp from './views/auth/SignUp.vue';
import Redirect from './views/auth/Redirect.vue';


const routes = [
  { 
    path: '/', 
    name: 'Home', 
    component: Home,
    meta: { title: 'Accueil - Silvernote' }
  },
  { 
    path: '/edit/:uuid', 
    name: 'Edit', 
    component: Edit,
    props: true,
    meta: { title: 'Silvernote' }
  },
  { 
    path: '/settings', 
    name: 'Settings', 
    props: {
      page: ""
    },
    component: Settings,
    meta: { title: 'Settings - Silvernote' }
  },
  { 
    path: '/settings/:page', 
    name: 'SettingsPage',
    props: true, 
    component: Settings,
    meta: { title: 'Settings - Silvernote' }
  },

  { 
    path: '/share/:uuid', 
    name: 'Share', 
    component: Share,
    props: true,
    meta: { title: 'Partage - Silvernote' }
  },

  // auth
  { 
    path: '/sauth/redirect',
    name: 'Redirect',
    component: Redirect,
    meta: { title: 'Redirection - Silvernote' }
  },
  { 
    path: '/sauth/sign-in/:pathMatch(.*)*',
    name: 'Sign-in',
    component: SignIn,
    meta: { title: 'Se connecter - Silvernote' }
  },

  { 
    path: '/sauth/sign-up/:pathMatch(.*)*',
    name: 'Sign-up',
    component: SignUp,
    meta: { title: 'Se créer un compte - Silvernote' }
  },

]

const isFileProtocol = window.location.protocol === 'file:'

const router = createRouter({
  history: isFileProtocol
    ? createWebHashHistory(import.meta.env.BASE_URL)  // pour Electron local
    : createWebHistory(import.meta.env.BASE_URL),    // pour Web/Express
  routes
});

router.beforeEach((to: any, _from: any, next: any) => {
  const title = to.meta.title as string;
  const favicon = to.meta.favicon as string;

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

  if (favicon) {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'icon');
      document.head.appendChild(link);
    }

    link.setAttribute('href', favicon);
  }

  next();
});



export default router
