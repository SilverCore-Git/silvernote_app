export default (() => {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;

    if (/android/i.test(ua)) return true;
    if (/iPhone|iPad|iPod/i.test(ua)) return true;
    if (/Mobile|Tablet|Opera Mini|IEMobile|WPDesktop/i.test(ua)) return true;

    if (
        navigator.platform === "MacIntel" &&
        navigator.maxTouchPoints > 1
    ) return true;

    if (/(ionic|capacitor|cordova)/i.test(ua)) return true;

    return false;
})();
