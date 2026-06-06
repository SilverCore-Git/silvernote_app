import * as Y from 'yjs';
import * as awarenessProtocol from 'y-protocols/awareness';
import { socketConnected, useRoom, useWSocket } from '@/composables/WSocket';
import waitFor from '@/assets/ts/utils/waitFor';
import postError from '../errorOverlay/postError';
import { editor } from './Editor';
import { nextTick, ref, type Ref } from 'vue';
import { Notes } from '@/assets/ts/database/Var';

let isOffline = false;

// Interface pour représenter un collaborateur
interface Collaborator {
  id: number;
  name: string;
  color: string;
  cursor?: { x: number; y: number } | null;
  lastActive: number;
}

// Fonction pour générer une couleur déterministe à partir d'un ID
export function getCollaboratorColor(clientId: number): string {
  // Générer une couleur déterministe à partir de l'ID
  let hash = clientId;
  for (let i = 0; i < 3; i++) {
    hash = ((hash << 5) - hash) + (hash * 17);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

const socket = useWSocket();

export class EditorProvider
{

    public doc: Y.Doc;
    public awareness: awarenessProtocol.Awareness;
    public synced: boolean = false;
    
    // Liste réactive des collaborateurs
    public collaborators: Ref<Collaborator[]> = ref<Collaborator[]>([]);

    private room: string = '';
    private shared: boolean = false;
    private editable: boolean = true;

    private updateHandler: ((update: Uint8Array, origin: any) => void) | null = null;
    private awarenessUpdateHandler: ((changes: any) => void) | null = null;
    private awarenessChangeHandler: (() => void) | null = null;

    constructor(
      doc: Y.Doc,
      room?: string,
      shared?: boolean,
    ) {

      this.doc = doc;
      this.room = room ?? '';
      this.shared = shared ?? false;
      this.editable = !this.shared;
      this.awareness = new awarenessProtocol.Awareness(doc);

      if (socketConnected.value)
      {
        this.setupListeners();
      }
      else
      {

        waitFor(
          () => socketConnected.value,
          5000
        ).then(async () => {

          if (!socketConnected.value)
          {
            console.error('EditorProvider: Socket not connected');
            postError({
              message: 'Socket not connected',
              place: 'EditorProvider'
            });
            return;
          }

          await this.setupListeners();

        });

      }

    }

    private async setupListeners()
    {

      (await socket).value.emit('get-initial-state', { roomId: this.room });

      // État initial du document
      (await socket).value.on('initial-state', ({ ydocState, share }: { ydocState: any, share: any }) => {

          if (this.synced) return;

          const note = Notes.value.find(note => note.uuid == this.room);

          if (note && note.content_type == 'text/html')
          {
            editor.value.commands.setContent(note.content);
          }
          else if (note?.content_type == 'ydoc' || (!note && this.shared))
          {

            const uint8State = ydocState instanceof Uint8Array 
                ? ydocState 
                : new Uint8Array(ydocState);

            if (uint8State.length > 0) 
            {
                try {
                    Y.applyUpdate(this.doc, uint8State, 'initial');
                } 
                catch (e) 
                {
                    console.error("❌ Erreur lors de l'application de l'état initial Yjs", e);
                }
            }

          }
          else
          {
            throw new Error(`Unsupported content type : ${note.content_type}`);
          }

          if (this.shared && share)
          {
            this.editable = share.params.editable || false;
          }


          this.synced = true;
          console.log('✅ Editor synced!');
        
          nextTick(() => {
              this.enableLocalUpdates();
          });

      });

      // Updates distants du document
      (await socket).value.on('y-update', ({ update }: { update: any }) => {
        
        const uint8Update = update instanceof Uint8Array
                ? update
                : new Uint8Array(update);

        Y.applyUpdate(this.doc, uint8Update, 'remote');
        
      });

      // Updates distants d'awareness (curseurs)
      (await socket).value.on('awareness-update', ({ update }: { update: any }) => {
        
        const uint8Update =
          update instanceof Uint8Array
            ? update
            : new Uint8Array(Object.values(update));

        awarenessProtocol.applyAwarenessUpdate(
          this.awareness,
          uint8Update,
          'remote'
        );
        
      });

      (await socket).value.on('ai-content-update', (data: { content: { html: string, pos: number }, room: string }) => {

          if (data.room !== this.room) return;

          if (!editor.value) return;

          let targetPos = data.content.pos;

          // Traduction du -1 en position réelle de fin de document
          if (targetPos === -1) {
              // .size donne la position juste après le dernier caractère du document
              targetPos = editor.value.state.doc.content.size; 
          }

          // Sécurité supplémentaire : s'assurer que la position n'est pas négative
          const safePos = Math.max(0, Math.min(targetPos, editor.value.state.doc.content.size));

          try {
              editor.value.commands.insertContentAt(safePos, data.content.html);
          }
          catch (e) {
              console.error("Erreur lors de l'insertion Tiptap : ", e);
          }
          
      });

      (await socket).value.on('connect', async () => {
        console.log('✅ Socket connected');
        this.enableLocalUpdates();
        const { join } = await useRoom();
        join({ room: this.room });
        if (isOffline) 
        {
          isOffline = false;
          window.dispatchEvent(new CustomEvent('note-save-online'));
        }
      });

      (await socket).value.on('disconnect', () => {
        isOffline = true;
        console.log('❌ Socket disconnected');
        this.disableLocalUpdates();
        window.dispatchEvent(new CustomEvent('note-save-offline'));
      });

      this.enableLocalUpdates();
    }

    private enableLocalUpdates()
    {
      console.log('🔧 Enabling local updates for room:', this.room);

      if (this.updateHandler || this.awarenessUpdateHandler) {
        console.log('⚠️ Local updates already enabled');
        return;
      }

      // Updates locaux du document
      this.updateHandler = async (update: Uint8Array, origin: any) => {
        
        if (origin !== 'remote' && this.editable && this.room) {
          (await socket).value.emit('y-update', { roomId: this.room, update });
        } else {
          console.log('❌ Not emitting y-update - origin:', origin, 'editable:', this.editable, 'room:', this.room);
        }
      };

      this.doc.on('update', this.updateHandler);

      // Updates locales d'awareness
      this.awarenessUpdateHandler = async ({ added, updated, removed }: any) => {

        const clients = added.concat(updated).concat(removed);
        const update = awarenessProtocol.encodeAwarenessUpdate(
          this.awareness,
          clients
        );
        
        if (this.editable && this.room) {
          (await socket).value.emit('awareness-update', { roomId: this.room, update });
        } else {
          console.log('❌ Not emitting awareness-update - editable:', this.editable, 'room:', this.room);
        }
        
        // Mettre à jour la liste des collaborateurs
        this.updateCollaborators();
      };

      this.awareness.on('update', this.awarenessUpdateHandler);
      
      // Écouter les changements locaux d'awareness pour mettre à jour les collaborateurs
      this.awarenessChangeHandler = () => this.updateCollaborators();
      this.awareness.on('change', this.awarenessChangeHandler);
      
      console.log('✅ Local updates enabled');

    }

    private disableLocalUpdates()
    {

      if (this.updateHandler) {
        this.doc.off('update', this.updateHandler);
        this.updateHandler = null;
      }

      if (this.awarenessUpdateHandler) {
        this.awareness.off('update', this.awarenessUpdateHandler);
        this.awarenessUpdateHandler = null;
      }

      if (this.awarenessChangeHandler) {
        this.awareness.off('change', this.awarenessChangeHandler);
        this.awarenessChangeHandler = null;
      }

    }

    /**
     * Met à jour la liste des collaborateurs à partir de l'awareness
     */
    private updateCollaborators(): void {
      const newCollaborators: Collaborator[] = [];
      const states = this.awareness.getStates();
      const myClientId = this.awareness.clientID;

      states.forEach((state: any, clientId: number) => {
        // Ne pas inclure soi-même
        if (clientId === myClientId) return;

        // Récupérer les informations de l'utilisateur
        const user = state.user || {};
        const name = user.name || `Utilisateur ${clientId % 1000}`;
        const color = getCollaboratorColor(clientId);

        // Récupérer la position du curseur si disponible
        let cursor: { x: number; y: number } | null = null;
        if (state.cursor) {
          cursor = {
            x: state.cursor.x || 0,
            y: state.cursor.y || 0,
          };
        }

        newCollaborators.push({
          id: clientId,
          name,
          color,
          cursor: cursor && (cursor.x > 0 || cursor.y > 0) ? cursor : null,
          lastActive: Date.now(),
        });
      });

      this.collaborators.value = newCollaborators;
    }

    public destroy()
    {

      this.disableLocalUpdates();
      this.awareness.destroy();

      socket.then(s => {
        s.value.off('initial-state');
        s.value.off('y-update');
        s.value.off('awareness-update');
        s.value.off('ai-content-update');
        s.value.off('connect');
        s.value.off('disconnect');
      })

    }

}

// Exporter le type pour qu'il puisse être utilisé dans d'autres fichiers
export type { Collaborator };