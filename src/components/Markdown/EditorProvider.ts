import * as Y from 'yjs';
import * as awarenessProtocol from 'y-protocols/awareness';
import { socketConnected, useWSocket } from '@/composables/WSocket';
import waitFor from '@/assets/ts/utils/waitFor';
import postError from '../errorOverlay/postError';
import { editor } from './Editor';
import { nextTick } from 'vue';
import type { Note } from '@/assets/ts/type';
import { Notes } from '@/assets/ts/database/Var';

let isOffline = false;

const socket = useWSocket();

export class EditorProvider
{

    public doc: Y.Doc;
    public awareness: awarenessProtocol.Awareness;
    public synced: boolean = false;

    private room: string = '';
    private editable: boolean = true;

    private updateHandler: ((update: Uint8Array, origin: any) => void) | null = null;
    private awarenessUpdateHandler: ((changes: any) => void) | null = null;

    constructor(
      doc: Y.Doc,
      room?: string,
      editable?: boolean
    ) {

      this.doc = doc;
      this.room = room ?? '';
      this.editable = editable ?? true;
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
      (await socket).value.on('initial-state', ({ ydocState }: { ydocState: any }) => {

          if (this.synced) return;

          const note = Notes.value.find(note => note.uuid == this.room);
          if (!note) return;

          if (note.content_type == 'text/html/crypted' || note.content_type == 'text/html')
          {
            console.log(note.content)
            editor.value.commands.setContent(note.content);
          }
          else if (note.content_type == 'ydoc')
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
      };

      this.awareness.on('update', this.awarenessUpdateHandler);
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