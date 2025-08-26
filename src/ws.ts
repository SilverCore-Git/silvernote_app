import { Server } from 'socket.io';
import { httpServer } from './app';
import config from './config.json';
import notes from './assets/ts/notes';
import JsonListManager from './assets/ts/db_json_manager';
import isEqual from 'lodash.isequal';

const share = new JsonListManager('share.json');

export const io = new Server(httpServer, {
    cors: { 
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    },
    path: '/socket.io/share/'
});

io.on('connection', (socket) => {

    console.log('Client connecté !');

    socket.on('join_share', async (data: { uuid: string }) => {

        const shareId = data.uuid;
        socket.join(shareId);

        const TheShare = await share.getByUUID(shareId);
        if (!TheShare) return;

        let lastNote = (await notes.getNoteByUUID(TheShare.note_uuid)).note;

        const interval = setInterval(async () => {
        const newNote = (await notes.getNoteByUUID(TheShare.note_uuid)).note;
        if (newNote && !isEqual(lastNote, newNote)) {
            lastNote = newNote;
            io.to(shareId).emit('update_note', {
            content: newNote.content,
            title: newNote.title,
            });
        }
        }, 1000);

        socket.on('disconnect', () => clearInterval(interval));

    });

});
