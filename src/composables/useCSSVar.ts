
interface CSSVarItem {
    name: string;
    value: string;
}

type CSSVar = CSSVarItem[];


const useCSSVar = () => {

    const getValue = (name: string): string => {
        const varName = name.startsWith('--') ? name : `--${name}`;
        return getComputedStyle(document.documentElement)
            .getPropertyValue(varName)
            .trim();
    };

    const setValue = (name: string, value: string): void => {
        const varName = name.startsWith('--') ? name : `--${name}`;
        document.documentElement.style.setProperty(varName, value);
        const cssv = cssVar.find(v => v.name == name);
        if (!cssv) return;
        cssv.value = value
    };

    const cssVar: CSSVar = [
        {
            name: 'bg',
            value: getValue('bg')
        },
        {
            name: 'bg2',
            value: getValue('bg2')
        },
        {
            name: 'text',
            value: getValue('text')
        },
        {
            name: 'white',
            value: getValue('white')
        },
        {
            name: 'btn',
            value: getValue('btn')
        }
    ];

    return {
        setValue,
        getValue,
        cssVar
    }

}


export default useCSSVar;

export {
    type CSSVar,
    type CSSVarItem
}
