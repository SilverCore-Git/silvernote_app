<template>

    <nav class="absolute h-21 top-0 left-0 w-screen z-50 bg-[var(--bg2)] flex justify-center items-center">

        <Nav_bar />

    </nav>


    <main class="flex flex-col items-center justify-center  text-center w-screen h-screen">


        <h2 class="text-3xl md:text-5xl font-bold uppercase mb-10 ">
            silvernote <span class="text-[var(--btn)]">{{ plans[priceId].name }}</span> dès <span class="text-[var(--btn)]">{{ price }}€</span>{{ parsedEach }}
        </h2>

        <button v-if="!isLoader" @click="create_checkout()" class="premium mt-5">
            Rejoidre le clan {{ plans[priceId].name }}
        </button>

        <Loader v-else :icon="false" />

        <div @click="scroll_to('more')" class=" absolute bottom-10 w-12 arrow tooltip" data-tooltip="Plus d'info !">
            <svg fill="#000000" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"><path d="M81.8457,25.3876a6.0239,6.0239,0,0,0-8.45.7676L48,56.6257l-25.396-30.47a5.999,5.999,0,1,0-9.2114,7.6879L43.3943,69.8452a5.9969,5.9969,0,0,0,9.2114,0L82.6074,33.8431A6.0076,6.0076,0,0,0,81.8457,25.3876Z"/></svg>
        </div>

    </main>

    <section id="more" class="flex flex-col items-center justify-center max-w-4xl mx-auto text-center text-[var(--text)] space-y-12 pt-20 mb-50">

        <h1 class=" font-extrabold uppercase tracking-tight leading-tight">
            Plus d'info !
        </h1>

        <p class="text-xl md:text-2xl max-w-2xl text-[var(--text)]">{{ plans[priceId].hook }}</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">

            <div 
                v-for="(asset,  index) of plans[priceId].assets"
                :key="index"
                class="bg-[var(--bg3)] p-8 rounded-lg shadow-md text-left"
            >

                <h3 class="text-3xl font-bold text-[var(--btn)] mb-4">{{ asset.title }}</h3>
                <p class="text-lg text-[var(--text)]">{{ asset.description }}</p>

            </div>

        </div>


    </section>

    <footer class="z-50 w-screen">
        <Footer />
    </footer>

</template>

<script lang="ts" setup>

import { useRoute } from 'vue-router';
import Footer from '../../components/Footer.vue'
import Nav_bar from '../../components/Nav_bar.vue'
import Loader from '../../components/Loader.vue';
import { ref } from 'vue';

const route = useRoute();

const isLoader = ref<boolean>(false);
const each = route.query.each;

const parsedEach = each == 'mounthly' ? '/mois' : each == 'yearly' ? '/ans' : ''
const price = route.query.price;
const mode = route.query.mode; // 'payment' or 'subscription'

const props = defineProps<{
    priceId: 'gold' | 'platinum' | 'ultimate'
}>()


const create_checkout = async (): Promise<void> => {

    isLoader.value = true;

    try {

        const response = await fetch(
            `http://localhost:3000/money/create/checkout/link/for/${plans[props.priceId].id}/withmode/${mode}`,
            { method: "POST" }
        );

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        const checkoutLink: { url: string } = await response.json();

        if (!checkoutLink?.url) {
            throw new Error("Invalid response format: missing URL");
        }

        window.location.href = checkoutLink.url;

    } catch (error) {
        console.error("Checkout creation failed:", error);
    } finally {
        isLoader.value = false;
    }
};

const plans: {

    gold: {
        id: string;
        name: string;
        hook: string;
        assets: {
            title: string;
            description: string;
        }[];
    },
    platinum: {
        id: string;
        name: string;
        hook: string;
        assets: {
            title: string;
            description: string;
        }[];
    },
    ultimate: {
        id: string;
        name: string;
        hook: string;
        assets: {
            title: string;
            description: string;
        }[];
    }

} = {
    
    gold: {
        id: "price_1RqJczI2ZY3BvIYk2afc7OQE",
        name: "Gold",
        hook: "Idéal pour les utilisateurs confirmés qui cherchent plus de **sécurité** et de capacité.",
        assets: [
            {
                title: 'Jusqu\'à 150 Notes & 50 Dossiers',
                description: 'Organisez vos idées et projets avec une capacité étendue pour toutes vos notes et dossiers.'
            },
            {
                title: 'Mode Hors Ligne',
                description: 'Accédez et modifiez vos notes même sans connexion internet, pour une productivité sans interruption.'
            },
            {
                title: 'Notes Chiffrées',
                description: 'Protégez vos informations les plus sensibles grâce à un chiffrement robuste, assurant votre confidentialité.'
            },
            {
                title: 'Accès Recommandé',
                description: 'Le choix parfait pour un équilibre optimal entre fonctionnalités avancées et sécurité.'
            }
        ]
    },

    platinum: {
        id: "price_1RqJczI2ZY3BvIYk2afc7OQE",
        name: "Platinum",
        hook: "Une offre avancée et **sans prise de tête** pour une gestion de notes simplifiée.",
        assets: [
            {
                title: 'Jusqu\'à 1000 Notes & 100 Dossiers',
                description: 'Élargissez votre espace de travail avec une capacité massive pour toutes vos créations et classifications.'
            },
            {
                title: 'Mode Hors Ligne Intégral',
                description: 'Profitez d\'une liberté totale pour travailler sur vos notes n\'importe où, n\'importe quand, sans dépendre du réseau.'
            },
            {
                title: 'Chiffrement Renforcé',
                description: 'Assurez la sécurité maximale de toutes vos données grâce à des protocoles de chiffrement de pointe.'
            },
            {
                title: 'Expérience Fluide',
                description: 'Conçu pour les utilisateurs avancés qui veulent l\'efficacité sans les complications.'
            }
        ]
    },

    ultimate: {
        id: "price_1RqJczI2ZY3BvIYk2afc7OQE",
        name: "Ultimate",
        hook: "L'**excellence** d'une offre illimitée pour une liberté totale dans SilverNote.",
        assets: [
            {
                title: 'Notes Illimitées',
                description: 'Créez autant de notes que vous le souhaitez, sans aucune limite, pour ne jamais être à court d\'espace.'
            },
            {
                title: 'Dossiers Illimités',
                description: 'Organisez vos projets de manière exhaustive avec un nombre illimité de dossiers, selon vos besoins.'
            },
            {
                title: 'Accès Hors Ligne Complet',
                description: 'Travaillez en toute sérénité, vos notes sont toujours accessibles, que vous soyez connecté ou non.'
            },
            {
                title: 'Sécurité Maximale',
                description: 'Toutes vos notes sont chiffrées, garantissant une protection inégalée de vos données les plus importantes.'
            }
        ]
    }
};


const scroll_to = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
    }
}

</script>

<style scoped>

@keyframes bounceArrow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(10px);
  }
}

.arrow {
  display: inline-block;
  animation: bounceArrow 1.2s ease-in-out infinite;
}

</style>