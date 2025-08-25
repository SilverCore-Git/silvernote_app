import express, { Request, Response } from "express";

import note_db from "../assets/ts/notes";
import tag_db from "../assets/ts/tags";

const router = express.Router();



// for notes
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

router.post('/delete/notes', async (req: Request, res: Response) => {
    res.json(await note_db.clearUserNotes(req.cookies.user_id));
});



// for tags
router.post('/new/tag', async (req: Request, res: Response) => {
    const tag = req.body.tag;
    tag.user_id = req.cookies.user_id;
    res.json(await tag_db.createTag(tag));
});

router.post('/update/a/tag', async (req: Request, res: Response) => {
    const tag = req.body.tag;
    tag.user_id = req.cookies.user_id;
    res.json(await tag_db.updateTag(tag));
});

router.post('/delete/a/tag', async (req: Request, res: Response) => {
    res.json(await tag_db.deleteTagByID(req.cookies.user_id, Number(req.query.id)));
});

router.get('/get/user/tags', async (req: Request, res: Response) => {
    res.json(await tag_db.getTagsByUserId(req.query.user_id as string));
});

router.post('/delete/tags', async (req: Request, res: Response) => {
    res.json(await tag_db.clearUserTags(req.cookies.user_id));
});



export default router;
