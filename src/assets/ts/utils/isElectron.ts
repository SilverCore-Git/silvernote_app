export default (() => {

    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    return /Silvernote/i.test(ua) && /Electron/i.test(ua);
    
})();
