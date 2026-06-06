

interface Page {
    path: string;
    icon: string;
    name: string;
}


const pages: Page[] = [
    {
        path: '/account',
        icon: "bi-person-fill",
        name: "Compte et Sécurité"
    },
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
    {
        path: '/help',
        icon: "bi-question-circle-fill",
        name: "Aide et Juridique"
    }
]

export { pages, type Page };