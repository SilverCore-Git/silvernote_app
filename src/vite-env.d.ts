/// <reference types="vite/client" />
declare module 'swiper/css';
declare module '*.vue' {
    import { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}
declare module 'vue3-virtual-scroller' {
    import { DefineComponent } from 'vue'

    export const RecycleScroller: DefineComponent<any, any, any>
    export const DynamicScroller: DefineComponent<any, any, any>
    export const DynamicScrollerItem: DefineComponent<any, any, any>

    const plugin: any
    export default plugin
}
