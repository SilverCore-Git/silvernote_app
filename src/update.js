
const { app } = require('electron');
const if_dev = process.env.DEV == 'true';
const path = require('path');
const fs = require('fs');
const { version } = require('../package.json');


class update {

    constructor(latest_release, appdata, window) {

        this.win = window;
        this.os = process.platform === 'win32' ? 'windows' : process.platform === 'darwin' ? 'macos' : 'linux';
        this.appdata = appdata;
        this.temp = path.join(appdata, 'temp');
        this.latest_release = latest_release;
        this.tag_name = latest_release.tag_name;
        this.base = 'https://github.com/SilverCore-Git/silvernote/releases/download';
        this.version = this.tag_name.slice(1);
        this.front_url = new URL(`${this.tag_name}/silvernote-front-${this.version}.zip`, this.base).href;
        
    }

    check () {

        try {

            if (this.version && this.version !== version) {
                return { new_v: this.version, old_v: version };
            }
            else 
            {
                return false;
            }

        }
        catch (err) {
            return console.error(`on check update : ${err}`);
        }

    }

    async install () {

        try {

            if (!fs.existsSync(this.temp)) fs.promises.mkdir(this.temp);

            let file_name;

            if (this.os == 'macos' || this.os == 'windows') 
            {
                file_name = `silvernote-${this.version}-${this.os == 'windows' ? 'win' : this.os}-setup.${this.os == 'windows' ? 'exe' : 'dmg'}`;
            }
            else 
            {
                const pkgType = require('fs').readFileSync('/etc/os-release', 'utf8').includes('debian') || require('fs').readFileSync('/etc/os-release', 'utf8').includes('ubuntu') ? 'deb' : 'rpm'; // => chat return rpm / deb
                file_name = `silvernote-${this.version}-${this.os == 'windows' ? 'win' : this.os}-setup.${pkgType}`;
            }

            const url = new URL(`${this.base}/${this.tag_name}/${file_name}`);
            
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Node.js script)',
                    'Accept': 'application/octet-stream'
                }
            });

            if (!response.ok) return console.error(`Download error : ${response.statusText}`);
            
            const arrayBuffer = await response.arrayBuffer();
            await fs.promises.writeFile(path.join(this.temp, file_name), Buffer.from(arrayBuffer));

            return true;

        }
        catch (err) {
            return console.error(`on installing update : ${err}`);
        }

    }

}

async function init_update(window) {
    const latest_release = await fetch('https://api.github.com/repos/silvercore-git/silvernote/releases/latest').then(res => res.json());
    const appdata = if_dev
        ? path.join(__dirname, '../data')
        : app.getPath(process.platform === 'win32' ? 'appData' : process.platform === 'darwin' ? 'appData' : 'home');

    return new update(latest_release, appdata, window);
}


module.exports = { init_update };