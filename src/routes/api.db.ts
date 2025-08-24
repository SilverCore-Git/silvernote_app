import express, { Request, Response } from "express";
import note_db from "../assets/ts/notes";

const router = express.Router();

router.post('/new/note', async (req: Request, res: Response) => {
    const note = req.body.note;
    note.user_id = req.cookies.user_id;
    res.json(await note_db.createNote(note));
});

router.get('/get/a/note', async (req: Request, res: Response) => {
    res.json(await note_db.getNoteByUUID(req.query.uuid as string));
});

router.post('/update/a/note', async (req: Request, res: Response) => {
    const note = req.body.note;
    note.user_id = req.cookies.user_id;
    res.json(await note_db.updateNote(note));
});

router.post('/delete/a/note', async (req: Request, res: Response) => {
    res.json(await note_db.deleteNoteByUUID(req.cookies.user_id, req.query.uuid as string));
});

router.get('/get/user/notes', async (req: Request, res: Response) => {
    res.json(await note_db.getNoteByUserId(req.query.user_id as string));
});

router.post('/clear/notes', async (req: Request, res: Response) => {
    res.json(await note_db.clearUserNotes(req.cookies.user_id));
});



export default router;
