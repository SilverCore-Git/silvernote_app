type PricingTier = string;
type PricingStructure = {
  family: {
    mounth: number;
    year: number;
  };
  solo: {
    mounth: number;
    year: number;
    life: number;
  };
};




const function_list: { title: string, content: string, svg: string }[] = [
    { 
        title: 'Multi-plateforme', 
        content: "<span class=\"underline\">Accédez</span> à vos notes depuis <span class=\"underline\">n'importe</span> quel appareil : smartphone, tablette, ordinateur de bureau ou navigateur web.", 
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-grid-white"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>` 
    },
    { 
        title: 'Synchronisation Cloud', 
        content: "Vos notes sont automatiquement <span class=\"underline\">synchronisées</span> et <span class=\"underline\">sauvegardées</span> en toute <span class=\"underline\">sécurité</span> dans le cloud.", 
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h3.79a4.5 4.5 0 1 1 0 9Z"/></svg>` 
    },
    { 
        title: 'Simple et intuitive', 
        content: "Une <span class=\"underline\">interface</span> épurée pour une prise de notes <span class=\"underline\">rapide</span> et sans distraction.", 
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-feather"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5.64 10.35a2 2 0 1 0 2.83 2.83L14.7 6.34a2 2 0 1 1 2.83 2.83L9.35 15.66a4 4 0 1 0 5.66 5.66L20.24 12.24z"/></svg>` 
    },
    { 
        title: 'Organisation facile', 
        content: "<span class=\"underline\">Organisez</span> vos notes en les épinglant, en les classant par dossier et par couleur, pour une <span class=\"underline\">gestion</span> <span class=\"underline\">optimale</span>.", 
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-notebook-text"><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><rect width="16" height="20" x="4" y="2" rx="2"/></svg>` 
    }
]


const pricing_plan_list: { 
    title: string, 
    for: string, 
    price: number, 
    functions: { 
        name: string, 
        includ: boolean 
    }[], 
    recommended: boolean 
}[] = [
    {
        title: "Silver",
        for: "Utilisateurs désirant tester la <span class=\"underline\">simplicité</span> de silvernote.",
        price: 0,
        functions: [
            { name: "jusqu'a 50 notes", includ: true },
            { name: "jusqu'a 20 dossiers", includ: true },
            { name: "mode hors ligne", includ: false },
            { name: "notes chiffrées", includ: false },
        ],
        recommended: false,
    },
    {
        title: "Gold",
        for: "Utilisateurs confirmé désirant plus de <span class=\"underline\">sécurité</span>.",
        price: 4, // + 0.99
        functions: [
            { name: "jusqu'a 150 notes", includ: true },
            { name: "jusqu'a 50 dossiers", includ: true },
            { name: "mode hors ligne", includ: true },
            { name: "notes chiffrées", includ: true },
        ],
        recommended: true,
    },
    {
        title: "Platinum",
        for: "Utilisateurs avancé, avec une offre <span class=\"underline\">sans</span> <span class=\"underline\">prise de tête</span>.",
        price: 9, // + 0.99
        functions: [
            { name: "jusqu'a 1000 notes", includ: true },
            { name: "jusqu'a 100 dossiers", includ: true },
            { name: "mode hors ligne", includ: true },
            { name: "notes chiffrées", includ: true },
        ],
        recommended: false,
    },
    {
        title: "Ultimate",
        for: "Utilisteurs désirant l'<span class=\"underline\">éxcélence</span> d'une offre <span class=\"underline\">illimité</span> !",
        price: 19, // + 0.99
        functions: [
            { name: "notes illimités", includ: true },
            { name: "dossiers illimités", includ: true },
            { name: "mode hors ligne", includ: true },
            { name: "notes chiffrées", includ: true },
        ],
        recommended: false,
    }
]

const pricing_plan_prices: Record<PricingTier, PricingStructure> = {

    Silver: {
        family: {
            mounth: 0 * 3,
            year: 0 * 3 * 8,
        },
        solo: {
            mounth: 0 * 1,
            year: 0 * 8,
            life: 0 * 12 * 4,
        },
    },
    
    Gold: {
        family: {
            mounth: Number(`${pricing_plan_list.find(plan => plan.title == 'Gold')?.price!}`) * 3,
            year: Number(`${pricing_plan_list.find(plan => plan.title == 'Gold')?.price!}`) * 3 * 8,
        },
        solo: {
            mounth: Number(`${pricing_plan_list.find(plan => plan.title == 'Gold')?.price!}`) * 1,
            year: Number(`${pricing_plan_list.find(plan => plan.title == 'Gold')?.price!}`) * 8,
            life: Number(`${pricing_plan_list.find(plan => plan.title == 'Gold')?.price!}`) * 12 * 4,
        },
    },
    
    Platinum: {
        family: {
            mounth: Number(`${pricing_plan_list.find(plan => plan.title == 'Platinum')?.price!}`) * 3,
            year: Number(`${pricing_plan_list.find(plan => plan.title == 'Platinum')?.price!}`) * 3 * 8,
        },
        solo: {
            mounth: Number(`${pricing_plan_list.find(plan => plan.title == 'Platinum')?.price!}`) * 1,
            year: Number(`${pricing_plan_list.find(plan => plan.title == 'Platinum')?.price!}`) * 8,
            life: Number(`${pricing_plan_list.find(plan => plan.title == 'Platinum')?.price!}`) * 12 * 4,
        },
    },
    
    Ultimate: {
        family: {
            mounth: Number(`${pricing_plan_list.find(plan => plan.title == 'Ultimate')?.price!}`) * 3,
            year: Number(`${pricing_plan_list.find(plan => plan.title == 'Ultimate')?.price!}`) * 3 * 8,
        },
        solo: {
            mounth: Number(`${pricing_plan_list.find(plan => plan.title == 'Ultimate')?.price!}`) * 1,
            year: Number(`${pricing_plan_list.find(plan => plan.title == 'Ultimate')?.price!}`) * 8,
            life: Number(`${pricing_plan_list.find(plan => plan.title == 'Ultimate')?.price!}`) * 12 * 4,
        },
    }

}


const plans: {
    gold: {
        name: string;
        hook: string;
        assets: {
            title: string;
            description: string;
        }[];
    },
    platinum: {
        name: string;
        hook: string;
        assets: {
            title: string;
            description: string;
        }[];
    },
    ultimate: {
        name: string;
        hook: string;
        assets: {
            title: string;
            description: string;
        }[];
    }

} = {
    
    gold: {
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


export {
    function_list,
    pricing_plan_list,
    plans,
    pricing_plan_prices
}