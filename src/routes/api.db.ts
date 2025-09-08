import express, { Request, Response } from "express";

import note_db from "../assets/ts/notes";
import tag_db from "../assets/ts/tags";

const router = express.Router();



function areArraysEqualIgnoreOrder<T>(a: T[], b: T[]): boolean {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;

    const normalize = (arr: T[]) =>
        [...arr]
            .map(item => typeof item === 'object'
                ? JSON.stringify(Object.keys(item as object).sort().reduce((acc, key) => {
                    (acc as Record<string, any>)[key] = (item as any)[key];
                    return acc;
                }, {} as Record<string, any>))
                : String(item)
            )
            .sort();

    const normA = normalize(a);
    const normB = normalize(b);

    return normA.every((val, idx) => val === normB[idx]);
}

router.post('/verify/data', async (req: Request, res: Response) => {

    try {

        const { notes, tags } = req.body as { notes: any[]; tags: any[] };
        const user_id: string | undefined = req.cookies?.user_id;

        if (!notes || !tags || !user_id) {
            res.json({ error: true, message: 'Missing parameters.' });
            return;
        }

        const db_notes = (await note_db.getNoteByUserId(user_id)).notes;
        const db_tags = (await tag_db.getTagsByUserId(user_id)).tags;

        const notesMatch = areArraysEqualIgnoreOrder(db_notes, notes);
        const tagsMatch = areArraysEqualIgnoreOrder(db_tags, tags); // pk ça renvoi false ??

        res.json({
            ok: notesMatch && tagsMatch,
            notes: notesMatch,
            notes_length: db_notes.length,
            tags: tagsMatch,
            tags_length: db_tags.length,
        });
        return;

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: 'Internal server error.' });
    }

});



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
