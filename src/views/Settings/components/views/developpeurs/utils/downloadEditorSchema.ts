import { schema } from '@/components/Markdown/Function/getSchema';
import createDownloadFile from '@/assets/ts/utils/createDownloadFile';


const downloadEditorSchema = () => {
    
    const schemaData: any = {
        nodes: {},
        marks: {}
    };

    schema.spec.nodes.forEach((name, nodeSpec) => {
        schemaData.nodes[name] = nodeSpec;
    });

    schema.spec.marks.forEach((name, markSpec) => {
        schemaData.marks[name] = markSpec;
    });

    try {
        createDownloadFile({
            content: JSON.stringify(schemaData, (_key, value) => {
                return typeof value === 'function' ? '[Function]' : value;
            }, 2),
            fileName: 'schema_spec.json',
            type: 'application/json'
        });
    } catch (error) {
        console.error("Erreur lors de l'export du schéma:", error);
        alert("Le schéma est trop complexe pour être exporté tel quel.");
    }

}

export default downloadEditorSchema;