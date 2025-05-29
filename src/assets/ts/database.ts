import Notes_json from '../notes.json';


class database {

    save( note: {
            id: number
            pinned: boolean
            simply_edit: boolean
            title: string
            content: string
            date: string
            tags: string[]
        })
    {

        

    };


    delete( id: number ) {

        Notes_json.filter(note => note.id == id);

    };


    create( note: {
            id: number
            pinned: boolean
            simply_edit: boolean
            title: string
            content: string
            date: string
            tags: string[]
        })
    {

        Notes_json.push( {
            id: note.id,
            pinned: note.pinned,
            simply_edit: note.simply_edit,
            title: note.title,
            content: note.content,
            date: note.date,
            tags: note.tags,
        } );

    };

};


export default new database();