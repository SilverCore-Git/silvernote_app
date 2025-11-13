import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home/Home.vue';


const routes = [
  { 
    path: '/', 
    name: 'Home', 
    component: Home,
    meta: { title: 'Accueil - Silvercore' }
  }
]



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to: any, _from: any, next: any) => {
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
