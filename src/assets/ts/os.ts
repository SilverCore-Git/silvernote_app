
class os {

    private userAgent = navigator.userAgent || navigator.vendor;
    
    public isAndroid (): boolean {
        return /android/i.test(this.userAgent);
    };

    public isIOS (): boolean {
        return /iPad|iPhone|iPod/.test(this.userAgent);
    };

    public isWindows (): boolean {
        return /Win(dows )?/i.test(this.userAgent);
    };

    public isMac (): boolean {
        return /Macintosh|MacIntel|Mac OS X/i.test(this.userAgent);
    };

    public isLinux (): boolean {
        return /Linux/i.test(this.userAgent) && !this.isAndroid();
    };

    public isChromeOS (): boolean {
        return /CrOS/i.test(this.userAgent);
    };

};


export default new os();
