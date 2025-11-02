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
      console.log('✅ Connected to collaboration server');
      this.socket.emit('join-room', { 
        room: this.room, 
        userId: this.userId 
      });
    });

    // Réception de l'état initial
    this.socket.on('sync', (state: Uint8Array) => {
      console.log('📥 Received initial sync');
      Y.applyUpdate(this.doc, state);
    });

    // Réception des updates Yjs
    this.socket.on('y-update', (update: Uint8Array) => {
      console.log('📩 Received y-update from server');
      Y.applyUpdate(this.doc, update);
    });

    // Réception des updates de titre
    this.socket.on('title-update', (newTitle: string) => {
      console.log('📝 Title updated:', newTitle);
      // Émettre un événement personnalisé pour le composant parent
      window.dispatchEvent(new CustomEvent('note-title-update', { 
        detail: { title: newTitle } 
      }));
    });

    // Réception des updates d'icône
    this.socket.on('icon-update', (newIcon: string) => {
      console.log('🎨 Icon updated');
      window.dispatchEvent(new CustomEvent('note-icon-update', { 
        detail: { icon: newIcon } 
      }));
    });

    // 🆕 Commandes de l'IA
    this.socket.on('ai-command', (data: { command: string; content: any }) => {
      console.log('🤖 Received AI command:', data.command);
      
      if (this.onAICommand) {
        this.onAICommand(data.command, data.content);
      }

      // Gérer les commandes directement ici si nécessaire
      if (data.command === 'insertContent') {
        // La commande sera gérée par le callback onAICommand
        // qui appelle editor.commands.setContent() ou insertContent()
      }
    });

    // Awareness (curseurs collaboratifs)
    this.socket.on('awareness-update', (update: Uint8Array) => {
      awarenessProtocol.applyAwarenessUpdate(this.awareness, update, 'remote');
    });

    // Envoyer les updates locaux
    this.doc.on('update', (update: Uint8Array) => {
      this.socket.emit('y-update', update);
    });

    // Envoyer les updates d'awareness
    this.awareness.on('update', ({ added, updated, removed }: any) => {
      const changedClients = added.concat(updated).concat(removed);
      const update = awarenessProtocol.encodeAwarenessUpdate(
        this.awareness,
        changedClients
      );
      this.socket.emit('awareness-update', update);
    });

    // Gestion des erreurs
    this.socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Disconnected from collaboration server');
    });
  }

  destroy() {
    console.log('🧹 Destroying SocketIO provider');
    this.awareness.destroy();
    this.socket.disconnect();
  }
}

export default SocketIOProvider;