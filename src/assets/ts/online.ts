const isOnline: boolean = localStorage.getItem('online') == "true" || navigator.onLine;

function toggle_online(state: boolean): void {

  localStorage.setItem('online', state ? 'true' : 'false');

}

export {
    isOnline,
    toggle_online
}