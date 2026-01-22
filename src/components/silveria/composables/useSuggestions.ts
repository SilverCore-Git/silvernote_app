
const suggestions: string[] = [
    
    "Transforme cette note en liste de tâches exploitable",
    "Organise ces pensées en un plan structuré",
    "Génère un résumé court pour l'aperçu",
    
    "Réécris cette note pour qu'elle soit plus concise",
    "Améliore le style pour un ton plus professionnel",
    "Corrige les fautes et reformule les phrases complexes",
    
    "Résume les points essentiels en 3 puces",
    "Identifie les thèmes principaux de cette note",
    
    "Suggère des tags pertinents pour classer cette note",
    "Trouve un titre percutant pour ce contenu"

];

const getThreeSuggestions = (): string[] => {
    return [...suggestions]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
};


export {
    suggestions,
    getThreeSuggestions
}
