import { createApp } from 'vue'
import Danger from '@/components/alert/Danger.vue'

class VueError {

    private app: ReturnType<typeof createApp> | null = null
    private mountPoint: HTMLElement | null = null

    constructor(message: string) {
        
        this.mountPoint = document.createElement('div')
        this.mountPoint.className = 'z-1000';
        document.body.appendChild(this.mountPoint)

        this.app = createApp(Danger, { value: message })

        this.app.mount(this.mountPoint)

        setTimeout(() => this.destroy(), 6000)
    }

    private destroy() {
        if (this.app && this.mountPoint) {
        this.app.unmount()
        document.body.removeChild(this.mountPoint)
        this.app = null
        this.mountPoint = null
        }
    }
}

export default VueError
