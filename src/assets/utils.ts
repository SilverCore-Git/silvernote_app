const scroll_to = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
    }
}

const openApp = (blank?: boolean) => {
    window.open('https://app.silvernote.fr', blank ? '_blank' : '')
}

export {
    scroll_to,
    openApp
}