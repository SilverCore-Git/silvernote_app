<template>

    <nav class="absolute h-21 top-0 left-0 w-screen z-50 bg-[var(--bg2)] flex justify-center items-center">

        <Nav_bar />

    </nav>


    <main class="flex flex-col items-center justify-center py-20 my-15 max-w-4xl mx-auto text-center text-[var(--text)] space-y-12">

        <h1 class="text-6xl md:text-8xl font-extrabold uppercase tracking-tight text-[var(--text-strong)] leading-tight">
            Découvrez <br class="md:hidden">SilverNote {{ plans[priceId].name }}
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

        <section class="mt-25">

            <h1 class="text-2xl md:text-4xl font-bold uppercase text-[var(--text-strong)] mb-10">
                silvernote {{ plans[priceId].name }} dès {{ price }}€{{ parsedEach }}
            </h1>

            <button v-if="!isLoader" @click="create_checkout()" class="premium">
                Rejoidre le clan {{ plans[priceId].name }}
            </button>

            <Loader v-else :icon="false" />

        </section>

    </main>

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

const price = 54;
const parsedEach = each == 'mounth' ? '/mois' : each == 'year' ? '/ans' : ''
const mode = 'payment' // or 'subscription'

const props = defineProps<{
    priceId: 'gold' | 'platinum' | 'ultimate'
}>()


const create_checkout = async (): Promise<void> => {

    isLoader.value = true;

    const checkoutLink: { url: string } = await fetch(`https://api.silvernote.fr/create/checkout/link/for/${plans[props.priceId].id}/withmode/${mode}`).then(res => res.json())

    window.location.href = checkoutLink.url;

}

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
        id: "price_465",
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
        id: "price_465",
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
        id: "price_465",
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

</script>
