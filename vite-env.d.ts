/// <reference types="vite/client" />

declare module 'swiper/css';
declare module 'swiper/css/pagination';
declare module 'swiper/css/navigation';

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
