import { onMounted, onUnmounted, computed } from "vue";

export function useShortcut(key: string | string[], label: string, callback: () => void) 
{

    const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    const modifier = isMac ? '⌘' : 'Ctrl';

    const keys = Array.isArray(key) ? key.map(k => k.toLowerCase()) : [key.toLowerCase()];

    const handleKeyDown = (event: KeyboardEvent) => {

        return; // fonction désactivée pour le moment

        const isModifierPressed = event.ctrlKey || event.metaKey;
        const keyPressed = event.key.toLowerCase();

        if (isModifierPressed && keys.includes(keyPressed)) 
        {

            const target = event.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) 
            {
                return;
            }

            event.preventDefault();
            callback();

        }

    };

    const tooltipConfig = computed(() => {

        return {
            content: `
                <div class="sn-tooltip">
                    <span class="sn-tooltip-label">${label}</span>
                    <div class="sn-tooltip-keys">
                        <kbd>${modifier}</kbd>
                        ${
                            keys.map(k => {
                                return `<span class="sn-tooltip-plus">+</span><kbd>${k}</kbd>`;
                            }).join('')
                        }
                    </div>
                </div>
            `,
            html: true,
            delay: { show: 600, hide: 100 },
        };

    });

    const cleanup = () => {
        window.removeEventListener('keydown', handleKeyDown);
    };

    onMounted(() => window.addEventListener('keydown', handleKeyDown));
    onUnmounted(cleanup);

    return { cleanup, tooltipConfig };

}