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
    },
    { 
        title: 'Boosté a l\'ia', 
        content: "<span class=\"underline\">Ameliorez</span> vôtre <span class=\"underline\">productivité</span> avec Jeremy, chatbot vous accompanant dans vos projets, vos idées et notes.", 
        svg: `<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" stroke="currentColor" viewBox="0 0 621.000000 623.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,623.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="currentColor"><path d="M3930 5224 c-6 -14 -10 -33 -10 -42 0 -9 -9 -48 -21 -87 -55 -184 -73 -241 -79 -250 -4 -5 -10 -23 -14 -40 -15 -65 -130 -289 -182 -355 -6 -8 -52 -55 -101 -105 -90 -91 -230 -186 -315 -214 -21 -7 -40 -17 -43 -22 -4 -5 -13 -9 -22 -9 -9 0 -34 -8 -57 -19 -23 -10 -75 -29 -116 -41 -41 -13 -100 -31 -130 -41 -30 -9 -70 -20 -89 -23 -47 -8 -151 -47 -151 -56 0 -9 36 -20 65 -20 11 0 52 -9 90 -21 39 -11 102 -30 140 -41 39 -12 91 -29 117 -39 26 -11 54 -19 62 -19 9 0 30 -9 48 -20 18 -11 43 -20 54 -20 12 0 27 -6 33 -14 7 -8 24 -17 38 -21 15 -3 38 -15 51 -26 14 -10 29 -19 34 -19 6 0 20 -8 33 -17 12 -10 33 -25 45 -33 50 -33 137 -110 167 -147 36 -46 143 -201 143 -209 0 -7 47 -111 66 -146 8 -14 14 -32 14 -40 1 -7 9 -31 20 -53 11 -22 19 -47 20 -56 0 -9 7 -33 15 -53 8 -19 20 -59 26 -88 6 -29 15 -58 19 -63 5 -6 14 -41 20 -78 10 -53 16 -67 30 -67 24 0 37 18 45 65 3 22 15 67 25 100 10 33 28 94 40 135 26 87 99 278 115 300 6 8 17 28 23 43 27 64 110 177 181 247 71 71 204 170 228 170 6 0 16 6 22 14 7 8 25 18 41 21 16 3 34 13 41 21 6 8 19 14 28 14 9 0 33 9 54 20 20 11 45 20 55 20 9 0 34 9 55 20 20 11 47 20 59 20 13 1 41 9 63 20 22 11 51 19 65 20 14 0 49 9 78 20 29 11 65 20 80 20 36 0 72 10 72 21 0 7 -61 27 -245 80 -70 20 -216 68 -287 95 -67 25 -192 89 -253 129 -199 132 -328 309 -433 595 -38 104 -100 312 -107 362 -6 37 -27 68 -46 68 -5 0 -14 -12 -19 -26z"/><path d="M4764 4928 c-32 -65 -78 -115 -124 -134 -62 -26 -67 -59 -12 -73 46 -13 94 -60 130 -129 15 -28 31 -52 37 -54 5 -2 15 18 23 44 16 57 79 123 133 140 55 16 51 45 -11 72 -61 27 -112 86 -125 144 -10 49 -22 47 -51 -10z"/><path d="M1930 4616 c-213 -56 -348 -189 -398 -391 -16 -64 -17 -166 -17 -1195 0 -1029 1 -1131 17 -1195 49 -199 210 -359 397 -395 73 -14 2308 -14 2382 0 139 26 293 147 357 282 61 126 63 152 60 895 -2 369 -6 674 -9 678 -10 9 -157 13 -171 4 -10 -7 -14 -155 -18 -706 -4 -539 -9 -707 -19 -737 -38 -116 -139 -204 -255 -225 -93 -17 -2202 -14 -2281 3 -119 25 -213 115 -249 238 -14 50 -16 168 -16 1156 0 1070 1 1102 20 1164 24 79 64 136 124 178 99 68 64 64 781 70 l650 5 0 95 0 95 -635 2 c-629 2 -636 2 -720 -21z"/><path d="M2776 3283 c-68 -224 -121 -325 -215 -411 -54 -49 -54 -49 -138 -91 -88 -44 -149 -66 -243 -87 -35 -8 -66 -17 -68 -19 -8 -8 88 -56 129 -64 58 -13 148 -46 162 -60 6 -6 15 -11 21 -11 5 0 28 -12 50 -27 161 -107 217 -194 302 -470 15 -50 31 -90 35 -87 4 2 10 19 14 37 9 45 42 150 72 227 48 123 130 226 228 287 37 24 142 73 154 73 6 0 22 6 34 14 12 8 39 17 61 21 42 7 126 45 126 56 0 4 -26 13 -57 19 -32 6 -72 18 -90 26 -17 8 -36 14 -42 14 -23 0 -137 53 -191 88 -107 70 -168 150 -228 297 -28 70 -60 173 -68 218 -3 20 -10 37 -14 37 -4 0 -20 -39 -34 -87z"/></g></svg>` 
    },
    {
        title: "Markdown",
        content: "Structurez et mettez en forme vos notes facilement grâce à la syntaxe Markdown. Titres, listes, gras, italique... tout est là pour une <span class=\"underline\">écriture</span> <span class=\"underline\">efficace</span> et <span class=\"underline\">organisée</span>.",
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 128 128" fill="currentColor" stroke="currentColor"><path d="M 29.09375 11.236328 C 25.90994 11.236328 23.375 13.802524 23.375 16.986328 L 23.375 111.01367 C 23.375 114.19747 25.90994 116.76367 29.09375 116.76367 L 98.90625 116.76367 C 102.09005 116.76367 104.625 114.19747 104.625 111.01367 L 104.625 40.361328 L 83.59375 40.361328 C 79.28764 40.361328 75.53125 37.220219 75.53125 33.048828 L 75.53125 11.236328 L 29.09375 11.236328 z M 79.53125 11.236328 L 79.53125 33.048828 C 79.53125 34.76295 81.16322 36.361328 83.59375 36.361328 L 104.625 36.361328 L 79.53125 11.236328 z M 44.890625 64.341797 L 51.744141 72.365234 L 58.599609 64.341797 L 67.166016 64.507812 L 67.166016 90.546875 L 58.599609 90.546875 L 58.599609 77.443359 L 51.777344 85.927734 L 51.777344 86.009766 L 51.744141 85.970703 L 51.712891 86.009766 L 51.712891 85.927734 L 44.890625 77.443359 L 44.890625 90.546875 L 36.324219 90.546875 L 36.324219 64.507812 L 44.890625 64.341797 z M 75.742188 64.341797 L 84.548828 64.341797 L 84.548828 77.761719 L 91.675781 77.761719 L 80.144531 93.083984 L 68.615234 77.761719 L 75.742188 77.761719 L 75.742188 64.341797 z"/></svg>`
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
            { name: "jusqu'a 100 notes", includ: true },
            { name: "jusqu'a 20 dossiers", includ: true },
            { name: "Jeremy", includ: false },
            { name: "Partage de note", includ: false },
        ],
        recommended: false,
    },
    {
        title: "Gold",
        for: "Utilisateurs confirmé.",
        price: 4, // + 0.99
        functions: [
            { name: "jusqu'a 200 notes", includ: true },
            { name: "jusqu'a 50 dossiers", includ: true },
            { name: "Jeremy (50 message /jours max)", includ: true },
            { name: "Partage de note", includ: true },
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
            { name: "Jeremy (100 message /jours max)", includ: true },
            { name: "Partage de note", includ: true },
        ],
        recommended: false,
    },
    {
        title: "Ultimate",
        for: "Utilisteurs désirant le <span class=\"underline\">confort</span> d'une offre <span class=\"underline\">illimité</span> !",
        price: 19, // + 0.99
        functions: [
            { name: "notes illimités", includ: true },
            { name: "dossiers illimités", includ: true },
            { name: "Jeremy illimité", includ: true },
            { name: "Partage de note", includ: true },
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
    Gold: {
        name: string;
        hook: string;
        assets: {
            title: string;
            description: string;
        }[];
    },
    Platinum: {
        name: string;
        hook: string;
        assets: {
            title: string;
            description: string;
        }[];
    },
    Ultimate: {
        name: string;
        hook: string;
        assets: {
            title: string;
            description: string;
        }[];
    }

} = {
    
    Gold: {
        name: "Gold",
        hook: "Idéal pour les utilisateurs confirmés qui cherchent plus de capacité.",
        assets: [
            {
                title: 'Jusqu\'à 200 Notes & 50 Dossiers',
                description: 'Organisez vos idées et projets avec une capacité étendue pour toutes vos notes et dossiers.'
            },
            {
                title: 'Jeremy',
                description: 'Découvrez Jeremy le chatbot la pour vous aider 24h/24h.'
            },
            {
                title: 'Partage de note',
                description: 'Partagez vos ou travailler a plusieur sur une même dernière.'
            }
        ]
    },

    Platinum: {
        name: "Platinum",
        hook: "Une offre avancée et sans prise de tête pour une gestion de notes simplifiée.",
        assets: [
            {
                title: 'Jusqu\'à 1000 Notes & 100 Dossiers',
                description: 'Élargissez votre espace de travail avec une capacité massive pour toutes vos créations et classifications.'
            },
            {
                title: 'Jeremy Intégral',
                description: 'Libérez vous l\'espris avec Jeremy.'
            }
        ]
    },

    Ultimate: {
        name: "Ultimate",
        hook: "Le confort d'une offre illimitée pour une liberté totale dans SilverNote.",
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
                title: 'Jeremy Illimité',
                description: 'Discutez sans limittes avec Jeremy en optimisant votre productivité.'
            }
        ]
    }
};


const we_can_buy: boolean = false;
const we_can_download: boolean = false;

export {
    function_list,
    pricing_plan_list,
    plans,
    pricing_plan_prices,
    we_can_buy,
    we_can_download
}