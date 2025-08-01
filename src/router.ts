import { createRouter, createWebHistory } from 'vue-router';

import Home from './views/Home.vue';
import Download from './views/Download.vue';
import Conditions_general_utilisation from './views/Conditions_general_utilisation.vue';
import Politique_de_confidentialite from './views/Politique_de_confidentialite.vue';
import Mentions_legales from './views/Mentions_legales.vue';
import Cancel from './views/pay/Cancel.vue';
import Success from './views/pay/Success.vue';
import Pricing from './views/pay/Pricing.vue';
import Profile from './views/user/Profile.vue';

const routes = [

  { 
    path: '/', 
    name: 'Home', 
    component: Home,
    props: {},
    meta: { title: 'SilverNote : vos notes partout !' }
  },
  { 
    path: '/download', 
    name: 'download', 
    component: Download,
    props: {},
    meta: { title: 'SilverNote - download' }
  },

  { 
    path: '/politique-de-confidentialite', 
    name: 'politique-de-confidentialite', 
    component: Politique_de_confidentialite,
    props: {},
    meta: { title: 'SilverNote - confidentialité' }
  },
  { 
    path: '/conditions-general-utilisation', 
    name: 'conditions-general-utilisation', 
    component: Conditions_general_utilisation,
    props: {},
    meta: { title: 'SilverNote - conditions general utilisation' }
  },
  { 
    path: '/mentions-legales', 
    name: 'mentions-legales', 
    component: Mentions_legales,
    props: {},
    meta: { title: 'SilverNote - mentions legales' }
  },

  { 
    path: '/pay/success', 
    name: 'pay success', 
    component: Success,
    props: {},
    meta: { title: 'SilverNote - fin du payement' }
  },
  { 
    path: '/pay/cancel', 
    name: 'pay cancel', 
    component: Cancel,
    props: {},
    meta: { title: 'SilverNote - annulation du payement' }
  },
  { 
    path: '/pay/pricing/:priceId', 
    name: 'pricing', 
    component: Pricing,
    props: true,
    meta: { title: 'SilverNote - annoncement du produit' }
  },

  { 
    path: '/user/profile', 
    name: 'profile', 
    component: Profile,
    props: {},
    meta: { title: 'SilverNote - profile' }
  },

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