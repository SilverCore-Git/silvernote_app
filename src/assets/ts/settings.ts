import { openDB, type IDBPDatabase, type DBSchema } from 'idb';
import type { Settings } from './type';

interface SettingsSchema extends DBSchema {
  settings: {
    key: string;
    value: Settings;
  };
}

class SettingsDB {

  private dbPromise: Promise<IDBPDatabase<SettingsSchema>>;

  constructor(initialSettings?: Settings) {

    this.dbPromise = openDB<SettingsSchema>('settings-db', 1, {

      upgrade(db) {

        if (!db.objectStoreNames.contains('settings')) {
          
          const store = db.createObjectStore('settings');
          if (initialSettings) {
            store.put(initialSettings, 'settings');
          };

        };

      }

    });

  };

  public async get(): Promise<Settings | undefined> {

    const db = await this.dbPromise;
    return db.get('settings', 'settings');

  };

  public async save(newSettings: Settings): Promise<void> {

    const db = await this.dbPromise;
    await db.put('settings', newSettings, 'settings');

  };

  public async clear(): Promise<void> {

    const db = await this.dbPromise;
    await db.clear('settings');

  };

};


const settings: Settings = {
  généraux: [
    { id: "", name: "Activer les notifications", type: "checkbox", active: false },
    { id: "", name: "Langue", type: "checkbox", active: false }
  ],
  avancé: [
    { id: "dev_mode", name: "Mode développeur", type: "checkbox", active: true }
  ],
  dev_mode: [
    { id: "hitbox", name: "Activer les hitbox", type: "checkbox", active: false },
    { id: "", name: "Afficher la console", type: "checkbox", active: false }
  ]
};


const hitbox = async (): Promise<boolean> => {
  const db = new SettingsDB();
  const parms = await db.get();
  return parms?.dev_mode.find(p => p.id == 'hitbox')?.active ?? false
};

export {
    settings,
    hitbox,
    SettingsDB
}