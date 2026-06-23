/**
 * API Cache Manager
 * Gère le cache des requêtes API dans IndexedDB
 * pour réduire les requêtes inutiles et améliorer les performances
 */

import { openDB } from 'idb';
import type { IDBPDatabase } from 'idb';

const DB_NAME = 'silvernote-api-cache';
const STORE_NAME = 'requests';

// Définir le type de la base de données IndexedDB
interface CacheEntry {
  data: any;
  timestamp: number;
  url: string;
  category?: string;
}

interface APICacheDB extends IDBPDatabase {
  [STORE_NAME]: {
    key: string;
    value: CacheEntry;
    indexes: {
      timestamp: number;
      category: string;
    };
  };
}

// TTL (Time To Live) par type de requête en millisecondes
const CACHE_TTL: Record<string, number> = {
  'notes': 5 * 60 * 1000,      // 5 minutes
  'tags': 10 * 60 * 1000,      // 10 minutes
  'user': 1 * 60 * 60 * 1000,   // 1 heure
  'settings': 1 * 60 * 60 * 1000, // 1 heure
  'default': 5 * 60 * 1000,     // 5 minutes (par défaut)
};

/**
 * Classe de gestion du cache API
 * Utilise IndexedDB pour stocker les réponses des requêtes
 */
export class APICache {
  private static dbPromise = openDB<APICacheDB>(DB_NAME, 1, {
    upgrade(db: IDBPDatabase<APICacheDB>) {
      // Créer le store avec url comme clé
      const store = db.createObjectStore(STORE_NAME, { keyPath: 'url' });
      // Créer un index pour le timestamp pour le nettoyage
      store.createIndex('timestamp', 'timestamp', { unique: false });
      // Créer un index pour la catégorie
      store.createIndex('category', 'category', { unique: false });
    },
  });

  /**
   * Récupère les données du cache si elles existent et ne sont pas expirées
   * @param url - URL de la requête
   * @param category - Catégorie de la requête (optionnel, utilise 'default' si non spécifié)
   * @returns Les données cachées ou null si non trouvées ou expirées
   */
  static async get(url: string, category: string = 'default'): Promise<any | null> {
    try {
      const db = await this.dbPromise;
      const entry = await db.get(STORE_NAME, url);

      if (!entry) {
        return null;
      }

      // Vérifier si l'entrée est expirée
      const ttl = CACHE_TTL[category] || CACHE_TTL['default'];
      if (Date.now() - entry.timestamp > ttl) {
        // Supprimer l'entrée expirée
        await this.delete(url);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error('[APICache] Erreur lors de la lecture du cache:', error);
      return null;
    }
  }

  /**
   * Stocke les données dans le cache
   * @param url - URL de la requête
   * @param data - Données à cacher
   * @param category - Catégorie de la requête (optionnel)
   */
  static async set(url: string, data: any, category: string = 'default'): Promise<void> {
    try {
      const db = await this.dbPromise;
      await db.put(STORE_NAME, {
        url,
        data,
        timestamp: Date.now(),
        category,
      });
    } catch (error) {
      console.error('[APICache] Erreur lors de l\'écriture dans le cache:', error);
    }
  }

  /**
   * Supprime une entrée spécifique du cache
   * @param url - URL de l'entrée à supprimer
   */
  static async delete(url: string): Promise<void> {
    try {
      const db = await this.dbPromise;
      await db.delete(STORE_NAME, url);
    } catch (error) {
      console.error('[APICache] Erreur lors de la suppression du cache:', error);
    }
  }

  /**
   * Supprime toutes les entrées du cache
   */
  static async clear(): Promise<void> {
    try {
      const db = await this.dbPromise;
      await db.clear(STORE_NAME);
    } catch (error) {
      console.error('[APICache] Erreur lors du vidage du cache:', error);
    }
  }

  /**
   * Supprime toutes les entrées expirées
   */
  static async clearExpired(): Promise<void> {
    try {
      const db = await this.dbPromise;
      const now = Date.now();
      
      // Récupérer toutes les entrées
      const allEntries = await db.getAll(STORE_NAME);
      
      // Filtrer les entrées non expirées
      const validEntries = allEntries.filter(entry => {
        const ttl = CACHE_TTL[entry.category || 'default'] || CACHE_TTL['default'];
        return now - entry.timestamp <= ttl;
      });
      
      // Vider le store et réécrire les entrées valides
      await db.clear(STORE_NAME);
      for (const entry of validEntries) {
        await db.put(STORE_NAME, entry);
      }
    } catch (error) {
      console.error('[APICache] Erreur lors du nettoyage du cache:', error);
    }
  }

  /**
   * Supprime toutes les entrées d'une catégorie spécifique
   * @param category - Catégorie à vider
   */
  static async clearCategory(category: string): Promise<void> {
    try {
      const db = await this.dbPromise;
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const index = store.index('category');
      
      const entries = await index.getAll(category);
      for (const entry of entries) {
        await store.delete(entry.url);
      }
      
      await tx.done;
    } catch (error) {
      console.error('[APICache] Erreur lors du vidage de la catégorie:', error);
    }
  }

  /**
   * Vérifie si une URL est dans le cache et n'est pas expirée
   * @param url - URL à vérifier
   * @param category - Catégorie (optionnel)
   * @returns true si l'URL est dans le cache et valide
   */
  static async has(url: string, category: string = 'default'): Promise<boolean> {
    const data = await this.get(url, category);
    return data !== null;
  }

  /**
   * Récupère la taille actuelle du cache
   * @returns Nombre d'entrées dans le cache
   */
  static async getSize(): Promise<number> {
    try {
      const db = await this.dbPromise;
      return await db.count(STORE_NAME);
    } catch (error) {
      console.error('[APICache] Erreur lors de la récupération de la taille:', error);
      return 0;
    }
  }
}

/**
 * Hook pour utiliser le cache API dans les composants
 * @returns Fonctions get, set, delete, clear du cache
 */
export function useAPICache() {
  return {
    get: APICache.get,
    set: APICache.set,
    delete: APICache.delete,
    clear: APICache.clear,
    clearExpired: APICache.clearExpired,
    clearCategory: APICache.clearCategory,
    has: APICache.has,
    getSize: APICache.getSize,
  };
}

export default APICache;
