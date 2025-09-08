import { Server } from 'socket.io';
import { httpServer } from './app';
import notes from './assets/ts/notes';
import JsonListManager from './assets/ts/db_json_manager';
import { Note } from './assets/ts/types';
import config from "./config.json";


const share = new JsonListManager('share.json');
const local_note_db = new Map<string, Note>();

setInterval(async () => {
    for (const note of local_note_db.values()) {
        await notes.updateNote(note);
    }
}, 5 * 1000);


export const io = new Server(httpServer, {
    cors: {
        origin: config.corsOptions.origin,
        methods: ["GET", "POST"]
    },
    path: '/socket.io/'
});


io.on('connection', (socket) => {

    console.log('Client connecté');

    // A client join a room
    socket.on('join_share', async ({ uuid }) => {
        socket.join(uuid);
        console.log(uuid)
    });

    // on edit
    socket.on('edit_note', async ({ uuid, content, title }) => {

        const noteUuid = uuid;
        
        if (!local_note_db.has(noteUuid)) {
            const result = await notes.getNoteByUUID(noteUuid);
            if (!result.note) return;
            local_note_db.set(noteUuid, result.note);
        }

        const note = local_note_db.get(noteUuid)!;
        if (content) note.content = content;
        if (title) note.title = title;

        socket.to(uuid).emit('update_note', { content: note.content, title: note.title });

        socket.emit('note_saved', { success: true });

    });

    socket.on('disconnect', () => {
        console.log('Client déconnecté');
    });

});
