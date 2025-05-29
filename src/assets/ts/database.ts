
import fs from 'fs';
import path from 'path';


interface Note {
    id: number;
    pinned: boolean;
    simply_edit: boolean;
    title: string;
    content: string;
    date: string;
    tags: string[];
}


class Database {

  private filePath: string;
  private data: Note[];

  constructor() {
    this.filePath = path.resolve('../notes.json');
    this.data = this.readFile();
  };

  private readFile(): Note[] {

    try {

      const content = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(content);

    } catch (error) {

      console.error('Erreur de lecture du fichier JSON:', error);
      return [];

    };

  };

  private writeFile(): void {

    try {

      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');

    } catch (error) {

      console.error('Erreur d’écriture du fichier JSON:', error);

    };

  };

  public save(note: Note): void {

    const index = this.data.findIndex(n => n.id === note.id);

    if (index !== -1) {

      this.data[index] = note;

    } else {

      this.data.push(note);

    };

    this.writeFile();

  };

  public delete(id: number): void {

    this.data = this.data.filter(note => note.id !== id);
    this.writeFile();

  };

  public create(note: Note): void {

    if (this.data.find(n => n.id === note.id)) {

      throw new Error(`Une note avec l'id ${note.id} existe déjà.`);

    };

    this.data.push(note);
    this.writeFile();

  };

  public getAll(): Note[] {

    return this.data;

  };

}


export default new Database();