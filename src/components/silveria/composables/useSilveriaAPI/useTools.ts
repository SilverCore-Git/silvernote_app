import { ref } from "vue"

interface Tool {
    name: string;
    result?: string;
    id: string;
    loading?: boolean;
    error?: string;
}

const tools = ref<Tool[]>([]);

const useTools = () => {

    const addTool = (tool: Tool) => {
        tools.value.push({
            ...tool,
            loading: true,
            result: undefined,
            error: undefined
        });
    }

    const addToolResult = (id: string, result?: string) => {
        const tool = tools.value.find(tool => tool.id === id);
        if (tool) {
            tool.result = result || '';
            tool.loading = false;
            tool.error = undefined;
        }
    }

    const failTool = (id: string, error: string) => {
        const tool = tools.value.find(tool => tool.id === id);
        if (tool) {
            tool.error = error;
            tool.loading = false;
        }
    }

    const getTool = (id: string) => {
        return tools.value.find(tool => tool.id === id);
    }

    return {
        addTool,
        addToolResult,
        failTool,
        getTool
    }

}

export {
    tools,
    type Tool,
    useTools
}
