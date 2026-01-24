import { dev } from '@/../package.json';

interface Page {
    path: string;
    icon: string;
    name: string;
}


const pages: Page[] = [
    {
        path: '/',
        icon: "bi-person", // Compte utilisateur
        name: "Compte"
    },
    // {
    //     path: '/preferences',
    //     icon: "bi-sliders", // Préférences / réglages généraux
    //     name: "Préférences"
    // },
    {
        path: '/appearance',
        icon: "bi-palette-fill", // Apparence / thème
        name: "Apparence"
    },
    {
        path: '/mydata',
        icon: "bi-database-fill", // Mes données / données personnelles
        name: "Mes données"
    },
    {
        path: '/legal',
        icon: "bi-shield-check", // Juridique / sécurité
        name: "Juridique"
    },
    dev ? {
        path: '/developpeurs',
        icon: "bi-code-slash",
        name: "Développeurs"
    } : {
        path: '',
        icon: "",
        name: ""
    },
]

export { pages, type Page };