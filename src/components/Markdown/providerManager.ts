import type * as Y from 'yjs';
import { SocketIOProvider } from './SocketIOProvider';
import type { Editor } from '@tiptap/vue-3';

const SYNC_TIMEOUT = 5000;

export async function initializeProvider(
  apiUrl: string,
  uuid: string,
  userId: string,
  ydoc: Y.Doc,
  onContentCommand: (command: string, content: string) => void
): Promise<SocketIOProvider> {
  const provider = new SocketIOProvider(
    apiUrl === 'http://localhost:3000' ? 'http://localhost:3434' : apiUrl,
    uuid,
    userId,
    ydoc,
    onContentCommand
  ) as any;

  await waitForSync(provider);
  return provider;
}

async function waitForSync(provider: SocketIOProvider): Promise<void> {
  return new Promise<void>((resolve) => {
    const onSync = () => {
      console.log('Initial sync completed');
      resolve();
    };

    const onConnect = () => {
      provider.socket.once('sync', onSync);
    };

    if (provider.socket.connected) {
      provider.socket.once('sync', onSync);
    } else {
      provider.socket.once('connect', onConnect);
    }

    // Safety timeout
    setTimeout(() => {
      console.warn('Sync timeout, proceeding anyway');
      resolve();
    }, SYNC_TIMEOUT);
  });
}

export function loadDocumentContent(
  editor: Editor,
  ydoc: Y.Doc,
  contentFromDb: string | undefined
): void {
  const fragment = ydoc.getXmlFragment('prosemirror');

  if (fragment.length === 0 && contentFromDb && contentFromDb.trim() !== '') {
    console.log('Loading HTML content from database (document is empty)');
    editor.commands.setContent(contentFromDb);
  } else if (fragment.length > 0) {
    console.log('Document already has collaborative content, skipping HTML load');
  } else {
    console.log('New empty document');
  }
}

export function cleanupProvider(
  provider: SocketIOProvider | null,
  autosaveInterval: ReturnType<typeof setInterval> | null
): void {
  if (provider) {
    provider.destroy();
  }
  if (autosaveInterval) {
    clearInterval(autosaveInterval);
  }
}
