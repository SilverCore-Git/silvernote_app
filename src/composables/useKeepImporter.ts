import { ref } from 'vue';
import JSZip from 'jszip';

export interface KeepNoteParsed {
    title: string;
    content: string;
    createdAt: string;
    labels: string[];
    isPinned: boolean;
}

export function useKeepImporter()
{

    const isProcessing = ref<boolean>(false);
    const progress = ref<number>(0);
    const currentFileName = ref<string>('');

    const parseKeepJson = async (jsonString: string): Promise<KeepNoteParsed | undefined> => {

        const data = JSON.parse(jsonString);

        // Conversion du contenu : Texte simple ou Listes de tâches
        let htmlContent = '';

        if (data.listContent) 
        {
            const items = data.listContent.map((item: any) => 
                `<li><p>${item.text}</p></li>` // Format list
            ).join('');
            htmlContent = `<ul>${items}</ul>`;
        } 
        else 
        {
            htmlContent = data.textContentHtml;
        }

        if (data.isArchived) return;

        return {
            title: data.title || '',
            content: htmlContent,
            createdAt: data.createdTimestampUsec 
                ? new Date(data.createdTimestampUsec / 1000).toISOString() 
                : new Date().toISOString(),
            labels: data.labels?.map((l: any) => l.name) || [],
            isPinned: data.isPinned || false
        };

    };

    const processZip = async (file: File, onNoteParsed: (note: KeepNoteParsed) => Promise<void>) => {

        isProcessing.value = true;
        progress.value = 0;

        try {

            const zip = new JSZip();
            const loadedZip = await zip.loadAsync(file);
            
            const jsonFiles = Object.keys(loadedZip.files).filter(path => {
                console.log(path)
                return (
                    path.includes('Keep/') &&            // Uniquement dossier Keep
                    path.endsWith('.json') &&              // Uniquement fichiers JSON
                    !loadedZip.files[path].dir
                );
            });

            const total = jsonFiles.length;
            let processed = 0;

            for (const path of jsonFiles) 
            {
                processed++;
                currentFileName.value = path.split('/').pop() || '';
                
                const content = await loadedZip.files[path].async('string');
                try {
                    const parsedNote = await parseKeepJson(content);
                    if (!parsedNote) continue;
                    await onNoteParsed(parsedNote);
                }
                catch (e) 
                {
                    console.error(`Erreur lors du parsing de ${path}:`, e);
                }

                progress.value = Math.round((processed / total) * 100);

            }

        } 
        catch (error) 
        {
            console.error("Erreur lors de la lecture du ZIP:", error);
            throw error;
        } 
        finally 
        {
            isProcessing.value = false;
            currentFileName.value = '';
        }

    };

    return {
        processZip,
        isProcessing,
        progress,
        currentFileName
    };

}