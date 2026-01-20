import * as Y from 'yjs';
import * as awarenessProtocol from 'y-protocols/awareness';
import { socket, socketConnected } from '@/composables/WSocket';
import waitFor from '@/assets/ts/utils/waitFor';
import postError from '../errorOverlay/postError';

export class EditorProvider
{

    public doc: Y.Doc;
    public awareness: awarenessProtocol.Awareness;

    private synced = false;

    private updateHandler: ((update: Uint8Array, origin: any) => void) | null = null;
    private awarenessUpdateHandler: ((changes: any) => void) | null = null;

    constructor(
      doc: Y.Doc,
    ) {

      this.doc = doc;
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

      // État initial du document
      socket.on('sync', (state: Uint8Array | any) => {
        const uint8State =
          state instanceof Uint8Array
            ? state
            : new Uint8Array(Object.values(state));

        if (uint8State.length > 0) {
          Y.applyUpdate(this.doc, uint8State, 'remote');
        }

        this.synced = true;
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

      // Updates distants d’awareness (curseurs)
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

      socket.on('disconnect', () => {
        this.disableLocalUpdates();
      });

    }

    private enableLocalUpdates()
    {

      if (this.updateHandler || this.awarenessUpdateHandler) return;

      // Updates locaux du document
      this.updateHandler = (update: Uint8Array, origin: any) => {
        if (origin !== 'remote' && this.synced) {
          socket.emit('y-update', update);
        }
      };
      this.doc.on('update', this.updateHandler);

      // Updates locales d’awareness
      this.awarenessUpdateHandler = ({ added, updated, removed }: any) => {
        const clients = added.concat(updated).concat(removed);
        const update = awarenessProtocol.encodeAwarenessUpdate(
          this.awareness,
          clients
        );
        socket.emit('awareness-update', update);
      };

      this.awareness.on('update', this.awarenessUpdateHandler);

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
      socket.disconnect();
      
    }

}
