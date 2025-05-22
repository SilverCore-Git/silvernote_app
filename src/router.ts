import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue'
import Edit from './views/Edit.vue';

const routes = [
  { 
    path: '/', 
    name: 'Home', 
    component: Home,
    props: {},
    meta: { title: 'Home' }
  },
  { 
    path: '/edit', 
    name: 'Edit', 
    component: Edit,
    props: {},
    meta: { title: 'Edit' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  from;
  const title = to.meta.title as string;
  if (title) {
    document.title = title;
  }
  next();
});

export default router
