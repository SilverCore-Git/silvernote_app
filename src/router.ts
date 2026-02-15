import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import { nextTick } from 'vue';

import Home from './views/Home/Home.vue';
import Edit from './views/Edit/Edit.vue';
import Settings from './views/Settings/Settings.vue';
import Share from './views/Share/Share.vue';
import SignIn from './views/auth/SignIn.vue';
import SignUp from './views/auth/SignUp.vue';
import Redirect from './views/auth/Redirect.vue';
import NotFound from './views/errors/404.vue';
import App2048 from './components/2048/App2048.vue';
import Onboarding from './views/onboarding/onboarding.vue';



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

  { 
    path: '/tools/2048', 
    name: '2048', 
    component: App2048,
    meta: { title: '2048 - Silvernote' }
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


  // on boarding
  { 
    path: '/onboarding/:page?',
    name: 'Onboarding',
    props: true,
    component: Onboarding,
    meta: { title: 'Bienvenue sur Silvernote' },
    beforeEnter: (to: any, _from: any, next: any) => {
      const validPages = ['start', 'usage', 'import', 'done'];
      if (!to.params.page || !validPages.includes(to.params.page as string)) {
        return next('/onboarding/start');
      }
      next();
    }
  },


  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: '404 - Silvernote' }
  }

]

const isFileProtocol = window.location.protocol === 'file:'

const router = createRouter({
  history: isFileProtocol
    ? createWebHashHistory(import.meta.env.BASE_URL)  // pour Electron local
    : createWebHistory(import.meta.env.BASE_URL),    // pour Web/Express
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { top: 0 }
  },
});

router.beforeResolve((to, from) => {

  const fromEdit = from.path.startsWith('/edit')
  const toEdit = to.path.startsWith('/edit')
  const isEditNew = to.path.startsWith('/edit/new')


  if (!(fromEdit || toEdit)) return;
  if (fromEdit && isEditNew)
  {
    router.push('/');
    return;
  }

  if (!document.startViewTransition) return;

  return new Promise((resolve) => {
    document.startViewTransition(async () => {
      resolve()
      await nextTick()
    })
  })
  
})


router.beforeEach((to, _from, next) => {
  
  if (to.query.silverIA) {
    const { silverIA, ...remainingQuery } = to.query;
    
    return next({
      params: to.params, 
      query: remainingQuery, 
      hash: to.hash,
      replace: true
    });
  }

  const title = to.meta.title as string;
  const favicon = to.meta.favicon as string;

  if (title)
  {

    document.title = title;

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);

  }

  if (favicon)
  {
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
