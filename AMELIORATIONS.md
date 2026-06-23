# 📋 Roadmap d'Améliorations pour Silvernote

*Dernière mise à jour : 6 juin 2026*

---

## 🎯 **Améliorations UI/UX (Priorité Haute)**

### 1. Barre de recherche globale
- **Problème** : Pas de recherche unifiée pour trouver des notes par titre ET contenu
- **Solution** : Ajouter une barre de recherche en haut de l'interface principale
- **Raccourci** : `Ctrl+K` / `Cmd+K`
- **Priorité** : ⭐⭐⭐⭐⭐
- **Effort** : Moyen

### 2. Drag & Drop amélioré
- **Problème** : Le Drag & Drop des notes pourrait être plus intuitif
- **Solution** :
  - Feedback visuel plus clair pendant le drag
  - Possibilité de réorganiser les notes dans la liste
  - Drag & Drop entre dossiers/tags
- **Priorité** : ⭐⭐⭐⭐
- **Effort** : Moyen

### 3. Mode plein écran pour l'éditeur
- **Problème** : Pas de mode distraction-free
- **Solution** : Bouton "Mode concentré" qui cache la sidebar et les outils
- **Priorité** : ⭐⭐⭐⭐
- **Effort** : Faible

### 4. Prévisualisation Markdown en temps réel
- **Problème** : Pas de vue split (éditeur + prévisualisation)
- **Solution** : Onglet ou split view pour voir le rendu Markdown
- **Priorité** : ⭐⭐⭐
- **Effort** : Moyen

---

## ⚡ **Optimisations Techniques**

### 1. Lazy Loading des composants
- **Problème** : Tous les composants sont chargés au démarrage
- **Solution** : Utiliser `defineAsyncComponent` pour les composants lourds
  - Éditeur Tiptap
  - Jeu 2048
  - Sélecteur d'emojis
- **Impact** : Réduction du bundle initial de ~30-40%
- **Priorité** : ⭐⭐⭐⭐⭐
- **Effort** : Faible

### 2. Cache des requêtes API
- **Problème** : Les notes et tags sont rechargés à chaque navigation
- **Solution** : Implémenter un cache simple (IndexedDB ou en mémoire)
- **Priorité** : ⭐⭐⭐⭐
- **Effort** : Moyen

### 3. Optimisation des images
- **Problème** : Les images uploadées ne sont pas optimisées
- **Solution** :
  - Compression automatique avant upload (max 2MB)
  - Lazy loading des images dans les notes (`loading="lazy"`)
  - WebP conversion pour les navigateurs supportés
- **Priorité** : ⭐⭐⭐⭐
- **Effort** : Moyen

### 4. Virtual Scrolling étendu
- **Problème** : Seulement partiellement implémenté
- **Solution** : Étendre `vue3-virtual-scroller` à :
  - La liste complète des notes
  - Les résultats de recherche
  - L'historique des versions
- **Priorité** : ⭐⭐⭐
- **Effort** : Moyen

---

## 📝 **Améliorations de l'Éditeur**

### 1. Collaboration en temps réel
- **Améliorations possibles** :
  - Indicateurs de présence (qui édite quelle partie)
  - Historique des modifications collaboratives
  - Résolution des conflits automatique
  - Couleurs différentes par utilisateur
- **Priorité** : ⭐⭐⭐⭐
- **Effort** : Élevé

### 2. Raccourcis clavier personnalisables
- **Problème** : Les raccourcis sont en dur dans le code
- **Solution** :
  - Page de configuration des raccourcis dans les paramètres
  - Sauvegarde dans `settingsDB`
  - Raccourcis par défaut :
    - `Ctrl+B` : Gras
    - `Ctrl+I` : Italique
    - `Ctrl+U` : Souligné
    - `Ctrl+S` : Sauvegarder
- **Priorité** : ⭐⭐⭐⭐
- **Effort** : Moyen

### 3. Templates de notes
- **Idée** : Permettre aux utilisateurs de créer des templates (modèles) de notes
- **Exemples de templates** :
  - Réunion (date, participants, points à discuter, actions)
  - Todo List (cases à cocher, priorités, échéances)
  - Fiche de révision (question/réponse, tags par matière)
  - Journal quotidien (date automatique, météo, humeur)
- **Priorité** : ⭐⭐⭐⭐
- **Effort** : Moyen

### 4. Intégration IA améliorée
- **Idées** :
  - Génération de notes à partir de texte (ex: "Crée une fiche de révision sur la photosynthèse")
  - Résumé automatique avec différentes longueurs (court/moyen/détaillé)
  - Traduction intégrée (français → anglais, espagnol, etc.)
  - Suggestions de tags automatiques basés sur le contenu
  - Correction orthographique en temps réel
- **Priorité** : ⭐⭐⭐⭐
- **Effort** : Élevé (dépend de l'API SilverIA)

---

## 🔒 **Sécurité & Données**

### 1. Sauvegarde automatique locale
- **Problème** : Si la connexion internet tombe, les modifications peuvent être perdues
- **Solution** :
  - Sauvegarde locale (IndexedDB) avec synchronisation différée
  - File d'attente pour les modifications non synchronisées
  - Indicateurs visuels de synchronisation en attente
- **Priorité** : ⭐⭐⭐⭐⭐
- **Effort** : Moyen

### 2. Chiffrement côté client transparent
- **Améliorations** :
  - Option pour exporter sa clé de chiffrement (backup)
  - Avertissement clair si la clé est perdue
  - Backup de la clé dans le compte utilisateur (optionnel, avec double authentification)
  - Vérification périodique de l'intégrité des données chiffrées
- **Priorité** : ⭐⭐⭐⭐⭐
- **Effort** : Moyen

### 3. Audit de sécurité
- **À vérifier/faire** :
  - Toutes les requêtes API utilisent `credentials: 'include'` ✅
  - Headers de sécurité dans les requêtes
  - Ajouter CSP (Content Security Policy) dans l'index.html
  - Protection CSRF
  - Sanitization du HTML (déjà présent via DOMPurify)
- **Priorité** : ⭐⭐⭐⭐
- **Effort** : Faible/Moyen

---

## 🌐 **Traduction & Internationalisation (i18n)**

### 1. Support multi-langues
- **Problème** : Tout est en dur en français
- **Solution** :
  - Extraire tous les textes dans des fichiers JSON (`/src/locales/`)
  - Commencer par l'anglais (pour le marché international)
  - Utiliser la librairie `vue-i18n`
  - Structure proposée :
    ```
    /src
    └── locales
        ├── en.json
        ├── fr.json
        └── es.json
    ```
- **Priorité** : ⭐⭐⭐⭐
- **Effort** : Élevé (mais valeur ajoutée énorme)

### 2. Détection automatique de la langue
- **Options** :
  - Basé sur la langue du navigateur (`navigator.language`)
  - Préférence utilisateur sauvegardée
  - Paramètre d'URL (`?lang=en`)
  - sauvé la langue dans les metadata clerk
- **Priorité** : ⭐⭐⭐
- **Effort** : Faible

---

## ♿ **Accessibilité (a11y)**

### 1. Améliorations WCAG
- **À faire** :
  - ✅ Ajouter `aria-label` sur tous les boutons icônes
  - Vérifier les contrastes de couleurs (certains textes grisés ont un contraste insuffisant)
  - Navigation au clavier complète (tab order logique)
  - Support screen reader (NVDA, VoiceOver)
  - Focus visible sur tous les éléments interactifs
- **Priorité** : ⭐⭐⭐⭐⭐
- **Effort** : Moyen

### 2. Mode haute visibilité
- **Idée** : Option pour :
  - Augmenter la taille de la police (jusqu'à 200%)
  - Augmenter les contrastes
  - Désactiver les animations
  - Épurer l'interface (moins d'éléments à l'écran)
- **Priorité** : ⭐⭐⭐
- **Effort** : Faible

---

## 📊 **Analytique & Feedback**

### 1. Statistiques d'utilisation
- **Idée** : Dashboard simple montrant :
  - Nombre de notes créées par jour/semaine/mois
  - Tags les plus utilisés (nuage de tags)
  - Temps passé dans l'app
  - Notes les plus modifiées
  - Taille totale des données
- **Priorité** : ⭐⭐⭐
- **Effort** : Moyen

### 2. Feedback utilisateur intégré
- **Options** :
  - Bouton "Donner son avis" dans les paramètres
  - Système de vote sur les notes (like/dislike)
  - Intégration avec Sentry pour les erreurs automatiques
  - Formulaire de bug report avec capture d'écran
- **Priorité** : ⭐⭐⭐
- **Effort** : Moyen

---

## 🎨 **Design & Thème**

### 1. Personnalisation du thème
- **Améliorations** :
  - Sélecteur de couleurs pour `--btn` (déjà partiellement là via l'easter egg)
  - Thèmes prédéfinis :
    - Sombre (dark)
    - Clair (light)
    - Solaire (jaune/orange)
    - Lunaire (bleu nuit)
    - Vert forêt
    - Rose pastel
  - Export/Import de thèmes (fichier JSON)
  - Partage de thèmes avec la communauté
- **Priorité** : ⭐⭐⭐⭐
- **Effort** : Moyen

### 2. Animations plus fluides
- **Idées** :
  - Transition entre les pages plus douce (fade + slide)
  - Animation de chargement plus élégante
  - Micro-interactions sur les boutons (hover, click)
  - Animation de succès après sauvegarde
- **Priorité** : ⭐⭐
- **Effort** : Faible

### 3. Responsive mobile amélioré
- **À vérifier/améliorer** :
  - L'éditeur sur petit écran (tester sur iPhone SE - 320px)
  - Le menu latéral en mode portrait
  - Les popups et modales (taille, position)
  - Le clavier virtuel qui cache le contenu
  - Touch targets plus grands (minimum 44x44px)
- **Priorité** : ⭐⭐⭐⭐⭐
- **Effort** : Moyen

---

## 🧩 **Fonctionnalités Avancées**

### 1. Versioning des notes
- **Fonctionnalités** :
  - Historique complet des versions
  - Restauration d'une version précédente
  - Comparaison de versions (diff visuel)
  - Limite de rétention configurable (7/30/90 jours/illimité)
  - Espace de stockage limité pour les versions
- **Priorité** : ⭐⭐⭐⭐⭐
- **Effort** : Élevé

### 2. Notes privées vs partagées - Améliorations
- **Idées** :
  - Indicateurs visuels plus clairs (icône de cadenas vs icône de partage)
  - Permissions fines :
    - Lecture seule
    - Autoriser les commentaires
    - Édition complète
    - Partage du partage (re-share)
  - Lien de partage personnalisable (slug)
  - Date d'expiration pour les liens partagés
  - Mot de passe optionnel pour les liens partagés
- **Priorité** : ⭐⭐⭐⭐
- **Effort** : Moyen

### 3. Intégrations tierces
| Intégration | Description | Priorité | Effort |
|-------------|-------------|----------|--------|
| Notion | Export vers Notion | ⭐⭐⭐⭐ | Moyen |
| Obsidian | Export en Markdown compatible Obsidian | ⭐⭐⭐⭐ | Moyen |
| Google Drive | Sauvegarde automatique sur Drive | ⭐⭐⭐ | Élevé |
| Dropbox | Sauvegarde automatique sur Dropbox | ⭐⭐⭐ | Élevé |
| Evernote | Import depuis Evernote | ⭐⭐⭐ | Moyen |
| OneNote | Import depuis OneNote | ⭐⭐⭐ | Moyen |
| Zapier | Automatisations | ⭐⭐ | Élevé |
| GitHub | Sauvegarde des notes en Markdown dans un repo | ⭐⭐⭐ | Moyen |

### 4. Mode hors ligne complet
- **Fonctionnalités** :
  - Détection automatique du mode hors ligne
  - File d'attente pour la synchronisation
  - Notification quand la connexion revient
  - Indicateurs de statut de synchronisation
  - Possibilité de travailler complètement hors ligne
- **Priorité** : ⭐⭐⭐⭐⭐
- **Effort** : Moyen

### 5. Recherche avancée
- **Fonctionnalités** :
  - Opérateurs booléens : `AND`, `OR`, `NOT`
  - Recherche par date : `created:2026-06-01..2026-06-05`
  - Recherche par taille : `size:>1MB`
  - Recherche dans les pièces jointes (PDF, images avec OCR)
  - Recherche par tag : `tag:important`
  - Recherche full-text améliorée
- **Priorité** : ⭐⭐⭐⭐
- **Effort** : Élevé

---

## 🚀 **Tableau de Bord - Idées "Nice to Have"**

| Idée | Description | Priorité | Effort | Statut |
|------|-------------|----------|--------|--------|
| Mode kiosque | Affichage note en plein écran, idéal pour les présentations | ⭐⭐⭐ | Moyenne | ❌ |
| Dark mode automatique | Suivre les préférences du système | ⭐⭐⭐ | Faible | ❌ |
| Raccourci nouvelle note rapide | `Ctrl+N` ou `Cmd+N` pour créer une note instantanément | ⭐⭐⭐⭐ | Faible | ❌ |
| Drag & Drop de fichiers | Depuis le bureau vers l'éditeur | ⭐⭐⭐ | Moyenne | ❌ |
| Épingler des notes | Épingler en haut de la liste pour un accès rapide | ⭐⭐⭐⭐ | Faible | ❌ |
| Favoris / Notes étoilées | Système de favoris pour les notes importantes | ⭐⭐⭐⭐ | Faible | ❌ |
| Calculatrice intégrée | Pour les notes avec des calculs | ⭐⭐ | Moyenne | ❌ |
| Dictée vocale | Transcription automatique | ⭐⭐⭐ | Moyenne | ❌ |
| Reconnaissance d'écriture | Pour mobile/tablette avec stylet | ⭐⭐ | Élevée | ❌ |
| Synchronisation avec Google Drive | Sauvegarde automatique | ⭐⭐⭐⭐ | Élevée | ❌ |
| Synchronisation avec Dropbox | Sauvegarde automatique | ⭐⭐⭐⭐ | Élevée | ❌ |
| Export PDF personnalisé | Avec mise en page avancée | ⭐⭐⭐ | Moyenne | ❌ |
| Import depuis email | Parser les emails pour créer des notes | ⭐⭐ | Élevée | ❌ |
| Widget pour mobile | Accès rapide depuis l'écran d'accueil | ⭐⭐⭐ | Moyenne | ❌ |
| Notifications push | Rappels, notes partagées | ⭐⭐⭐ | Moyenne | ❌ |

---

## 📌 **Ce qui a déjà été corrigé** *(5 commits)*

### Commit 1: Réorganisation des onglets de paramètres
- **Changements** :
  - Fusion de "Compte" + "Sécurité" → "Compte et Sécurité"
  - Fusion de "Juridique" + "Support" → "Aide et Juridique"
  - Suppression de "Préférences" (vide)
  - Suppression de "Développeurs" (commenté)
  - **Résultat** : 7 onglets → 4 onglets

### Commit 2: Correction de fautes d'orthographe
- **Corrections** :
  - "Sécuritée" → "Sécurité"
  - "vôtre" → "votre"
  - "donnés" → "données"
  - "irreversible" → "irréversible"
  - "séléctionnées" → "sélectionnées"
  - "tags" → "étiquettes" (cohérence)
  - "Supprimer tout" → "Tout supprimer"
  - "google keep" → "Google Keep"

### Commit 3: Correction de bugs divers
- **Corrections** :
  - CSS light mode dans index.html (fond blanc au lieu de noir)
  - `updateAvalable.vue` → `updateAvailable.vue` (renommage)
  - Traduction : "Code block" → "Bloc de code"

### Commit 4: Correction de syntaxe Tailwind CSS
- **Correction** :
  - `text(--text-little)` → `text-(--text-little)` dans Navbar.vue

### Commit 5: Correction de duplication CSS
- **Correction** :
  - Suppression du sélecteur CSS dupliqué `.default-input-border-p-0,`

---

## 🛠 **Prochaines Étapes Recommandées**

### Sprint 1 (1-2 semaines) - UX Critique
- [ ] Barre de recherche globale avec `Ctrl+K`
- [ ] Mode plein écran pour l'éditeur
- [ ] Lazy loading des composants lourds
- [ ] Correction complète des problèmes d'accessibilité
- [ ] **Fix : Icônes Bootstrap qui ne s'affichent plus** *(À corriger en priorité)*

### Sprint 2 (2-3 semaines) - Fonctionnalités Clés
- [ ] Versioning des notes
- [ ] Templates de notes
- [ ] Optimisation des images
- [ ] Début de l'internationalisation (i18n)

### Sprint 3 (3-4 semaines) - Avancé
- [ ] Collaboration améliorée
- [ ] Recherche avancée
- [ ] Intégrations tierces (Notion/Obsidian)
- [ ] Statistiques d'utilisation

---

## 📊 **Métriques Clés à Améliorer**

| Métrique | Valeur Actuelle | Cible | Action |
|----------|------------------|-------|--------|
| Taille du bundle | ~5MB | <3MB | Lazy loading, compression |
| Temps de chargement | ~2-3s | <1s | Optimisations |
| Score Lighthouse | ? | >90 | Accessibilité, performance |
| Taux de rétention | ? | +20% | Nouvelles fonctionnalités |
| Notes par utilisateur | ~50 | +100 | Motivations (stats, templates) |

---

## 💡 **Idées Innovantes**

### 1. Mode "Focus Pomodoro"
- Timer intégré 25/5 minutes
- Bloque les notifications pendant la session
- Statistiques de productivité

### 2. Notes collaboratives avec cursor live
- Voir les curseurs des autres utilisateurs en temps réel
- Chat intégré dans la note
- Historique des contributions

### 3. Système de gamification
- Badges pour l'utilisation régulière
- Récompenses (thèmes premium, espace supplémentaire)
- Classement (optionnel, désactivable)

### 4. Intégration avec l'IA générative
- Génération de notes à partir de prompts
- Complétion automatique de phrases
- Analyse sémantique pour suggestions de tags

### 5. Mode "Journal intelligent"
- Détection automatique de la date/heure
- Suggestions de template basé sur le jour de la semaine
- Analyse de sentiments (via IA)

---

## 📝 **Comment Contribuer**

1. **Choisir une tâche** dans ce document
2. **Créer une branche** : `git checkout -b feat/nom-de-la-fonctionnalite`
3. **Développer** en suivant les conventions du projet
4. **Tester** localement : `npm run dev`
5. **Vérifier** : `npm run verify` (pas d'erreurs TypeScript)
6. **Commiter** avec un message clair
7. **Pousser** : `git push origin feat/nom-de-la-fonctionnalite`
8. **Créer une PR** avec description et lien vers cette issue

---

*Document généré par Mistral Vibe - 6 juin 2026*
