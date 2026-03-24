

interface Page {
    path: string;
    icon: string;
    name: string;
}


const pages: Page[] = [
    {
        path: '/account',
        icon: "bi-person-fill",
        name: "Compte"
    },
    {
        path: '/security',
        icon: "bi-shield-lock-fill",
        name: "Sécurité & Confidentialité"
    },
    // {
    //     path: '/preferences',
    //     icon: "bi-sliders",
    //     name: "Préférences"
    // },
    {
        path: '/appearance',
        icon: "bi-palette-fill",
        name: "Apparence"
    },
    {
        path: '/mydata',
        icon: "bi-database-fill",
        name: "Mes données"
    },
    // {
    //     path: '/2048',
    //     icon: "bi-grid-3x3",
    //     name: "Jeu 2048"
    // },
    {
        path: '/legal',
        icon: "bi-shield-fill-check",
        name: "Juridique"
    },
    {
        path: '/support',
        icon: "bi-question-circle-fill",
        name: "Support"
    },
    // {
    //     path: '/developpeurs',
    //     icon: "bi-code-slash",
    //     name: "Développeurs"
    // }
]

export { pages, type Page };