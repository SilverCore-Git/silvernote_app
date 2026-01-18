import { ref } from "vue"

interface Tool {
    name: string;
    result?: string;
    id: string;
}

const tools = ref<Tool[]>([]);

const useTools = () => {

    const addTool = (tool: Tool) => {
        tools.value.push(tool);
    }

    const addToolResult = (id: string, result: string) => {
        const tool = tools.value.find(tool => tool.id === id);
        if (tool) {
            tool.result = result;
        }
    }

    const getTool = (id: string) => {
        return tools.value.find(tool => tool.id === id);
    }

    return {
        tools,
        addTool,
        addToolResult,
        getTool
    }

}

export {
    type Tool,
    useTools
}