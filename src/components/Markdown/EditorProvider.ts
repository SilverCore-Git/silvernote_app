import * as Y from 'yjs';
import * as awarenessProtocol from 'y-protocols/awareness';
import { socket, socketConnected, useRoom } from '@/composables/WSocket';
import waitFor from '@/assets/ts/utils/waitFor';
import postError from '../errorOverlay/postError';
import { editor } from './Editor';

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
        ).then(() => {

          if (!socketConnected.value)
          {
            console.error('EditorProvider: Socket not connected');
            postError({
              message: 'Socket not connected',
              place: 'EditorProvider'
            });
            return;
          }

          this.setupListeners();

        });

      }

    }

    private setupListeners()
    {

      const { join, leave } = useRoom();

      leave(this.room);
      join({ room: this.room, userId: window.localStorage.getItem('user_id') ?? '' });

      // État initial du document
      socket.on('sync', (state: Uint8Array | any) => {

        if (this.synced) return;

        const currentUpdate = Y.encodeStateAsUpdate(this.doc);
        console.log('leng : ', currentUpdate.length)
        if (currentUpdate.length > 2) {
          this.synced = true;
          this.enableLocalUpdates();
          return;
        }

        const uint8State =
          state instanceof Uint8Array
            ? state
            : new Uint8Array(Object.values(state));

        if (uint8State.length > 0) {
          Y.applyUpdate(this.doc, uint8State, 'remote');
        }

        this.synced = true;
        console.log('✅ Editor synced!');
        this.enableLocalUpdates();
      });

      // Updates distants du document
      socket.on('y-update', (update: Uint8Array | any) => {
        
        const uint8Update =
          update instanceof Uint8Array
            ? update
            : new Uint8Array(Object.values(update));

        Y.applyUpdate(this.doc, uint8Update, 'remote');
        
      });

      // Updates distants d'awareness (curseurs)
      socket.on('awareness-update', (update: Uint8Array | any) => {
        
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

      socket.on('ai-content-update', (data: { content: { html: string, pos: number }, room: string }) => {

        if (data.room !== this.room) return;

        if (editor.value) {
          editor.value.commands.insertContentAt(data.content.pos, data.content.html);
        }

      });

      socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
        this.disableLocalUpdates();
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
      this.updateHandler = (update: Uint8Array, origin: any) => {
        
        if (origin !== 'remote' && this.editable && this.room) {
          socket.emit('y-update', update);
        } else {
          console.log('❌ Not emitting y-update - origin:', origin, 'editable:', this.editable, 'room:', this.room);
        }
      };

      this.doc.on('update', this.updateHandler);

      // Updates locales d'awareness
      this.awarenessUpdateHandler = ({ added, updated, removed }: any) => {

        const clients = added.concat(updated).concat(removed);
        const update = awarenessProtocol.encodeAwarenessUpdate(
          this.awareness,
          clients
        );
        
        if (this.editable && this.room) {
          socket.emit('awareness-update', update);
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

    destroy()
    {
      this.disableLocalUpdates();
      this.awareness.destroy();
    }

}