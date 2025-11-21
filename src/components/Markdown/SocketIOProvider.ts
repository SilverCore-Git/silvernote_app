// SocketIOProvider.ts
import { io, Socket } from 'socket.io-client';
import * as Y from 'yjs';
import * as awarenessProtocol from 'y-protocols/awareness';

export class SocketIOProvider {
  public socket: Socket;
  public doc: Y.Doc;
  public awareness: awarenessProtocol.Awareness;
  private room: string;
  private userId: string;
  private onAICommand?: (command: string, content: any) => void;
  private synced: boolean = false;
  private updateHandler: ((update: Uint8Array, origin: any) => void) | null = null;
  private awarenessUpdateHandler: ((changes: any) => void) | null = null;

  constructor(
    serverUrl: string,
    room: string,
    userId: string,
    doc: Y.Doc,
    onAICommand?: (command: string, content: any) => void
  ) {
    this.doc = doc;
    this.room = room;
    this.userId = userId;
    this.onAICommand = onAICommand;
    this.awareness = new awarenessProtocol.Awareness(doc);

    // Connexion au serveur
    this.socket = io(serverUrl, {
      path: '/socket.io/share',
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    this.setupListeners();
  }

  private setupListeners() {
    // Connexion établie
    this.socket.on('connect', () => {
      console.log('Connected to collaboration server');
      this.socket.emit('join-room', { 
        room: this.room, 
        userId: this.userId 
      });
    });

    // Réception de l'état initial
    this.socket.on('sync', (state: Uint8Array) => {
      try {
        console.log('Received initial sync, state length:', state.length);
        
        const uint8State = state instanceof Uint8Array 
          ? state 
          : new Uint8Array(Object.values(state));
        
        // Appliquer seulement si le document est vide
        if (uint8State.length > 0) {
          Y.applyUpdate(this.doc, uint8State);
          console.log('Initial state applied successfully');
        } else {
          console.warn('Empty initial state received');
        }
        
        this.synced = true;
        
        this.enableLocalUpdates();
        
      } catch (err) {
        console.error('Error applying initial sync:', err);
        this.synced = true;
        this.enableLocalUpdates();
      }
    });

    // Réception des updates Yjs
    this.socket.on('y-update', (update: Uint8Array | any) => {
      try {
        console.log('Received y-update from server');
        const uint8Update = update instanceof Uint8Array 
          ? update 
          : new Uint8Array(Object.values(update));
        
        Y.applyUpdate(this.doc, uint8Update);
      } catch (err) {
        console.error('Error applying y-update:', err);
      }
    });

    // Réception des updates de titre
    this.socket.on('title-update', (newTitle: string) => {
      console.log('Title updated:', newTitle);
      window.dispatchEvent(new CustomEvent('note-title-update', { 
        detail: { title: newTitle } 
      }));
    });

    // Réception des updates d'icône
    this.socket.on('icon-update', (newIcon: string) => {
      console.log('Icon updated');
      window.dispatchEvent(new CustomEvent('note-icon-update', { 
        detail: { icon: newIcon } 
      }));
    });

    // Commandes de l'IA
    this.socket.on('ai-command', (data: { command: string; content: any }) => {
      console.log('Received AI command:', data.command);
      if (this.onAICommand) {
        this.onAICommand(data.command, data.content);
      }
    });

    // Awareness (curseurs collaboratifs)
    this.socket.on('awareness-update', (update: Uint8Array | any) => {
      const uint8Update = update instanceof Uint8Array 
        ? update 
        : new Uint8Array(Object.values(update));
      awarenessProtocol.applyAwarenessUpdate(this.awareness, uint8Update, 'remote');
    });

    // Gestion des erreurs
    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from collaboration server');
      this.disableLocalUpdates();
    });
  }

  // ✅ Activer l'envoi des updates locaux uniquement après la sync initiale
  private enableLocalUpdates() {
    if (this.updateHandler || this.awarenessUpdateHandler) {
      return; // Déjà activé
    }

    // Envoyer les updates locaux
    this.updateHandler = (update: Uint8Array, origin: any) => {
      // Ne pas renvoyer les updates qui viennent du serveur
      if (origin !== 'remote' && this.synced) {
        this.socket.emit('y-update', update);
      }
    };
    this.doc.on('update', this.updateHandler);

    // Envoyer les updates d'awareness
    this.awarenessUpdateHandler = ({ added, updated, removed }: any) => {
      const changedClients = added.concat(updated).concat(removed);
      const update = awarenessProtocol.encodeAwarenessUpdate(
        this.awareness,
        changedClients
      );
      this.socket.emit('awareness-update', update);
    };
    this.awareness.on('update', this.awarenessUpdateHandler);

    console.log('Local updates enabled');
  }

  // ✅ Désactiver l'envoi des updates
  private disableLocalUpdates() {
    if (this.updateHandler) {
      this.doc.off('update', this.updateHandler);
      this.updateHandler = null;
    }
    if (this.awarenessUpdateHandler) {
      this.awareness.off('update', this.awarenessUpdateHandler);
      this.awarenessUpdateHandler = null;
    }
  }

  destroy() {
    console.log('Destroying SocketIO provider');
    this.disableLocalUpdates();
    this.awareness.destroy();
    this.socket.disconnect();
  }
}

export default SocketIOProvider;