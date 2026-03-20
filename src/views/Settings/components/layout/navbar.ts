

interface Page {
    path: string;
    icon: string;
    name: string;
}


const pages: Page[] = [
    {
        path: '/',
        icon: "bi-person-fill", // Compte utilisateur
        name: "Compte"
    },
    {
        path: '/security',
        icon: "bi-shield-lock-fill", // Juridique / sécurité
        name: "Sécuritée"
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
    // {
    //     path: '/2048',
    //     icon: "bi-grid-3x3", // Juridique / sécurité
    //     name: "Jeu 2048"
    // },
    {
        path: '/legal',
        icon: "bi-shield-fill-check", // Juridique / sécurité
        name: "Juridique"
    },
    // {
    //     path: '/developpeurs',
    //     icon: "bi-code-slash",
    //     name: "Développeurs"
    // }
]

export { pages, type Page };