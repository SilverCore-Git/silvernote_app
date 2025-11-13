import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import 'bootstrap-icons/font/bootstrap-icons.css';

const app = createApp(App);

app.directive("fade", {
    beforeMount(el) {
        // état initial invisible
        el.style.opacity = 0;
        el.style.transform = "translateY(100px)";
        el.style.transition = "opacity 1s ease, transform .6s ease";
    },
    mounted(el) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        el.style.opacity = 1;
                        el.style.transform = "translateY(0)";
                        observer.unobserve(el);
                    }
                });
            },
            {
                threshold: 0.2
            }
        );

        observer.observe(el);
    }
});

app.use(router);

app.mount('#app')
