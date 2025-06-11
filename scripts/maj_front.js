const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const unzipper = require('unzipper');
const util = require('util');

const execAsync = util.promisify(exec);

const temp_dir = path.join(__dirname, '../temp');
const front_path = path.join(__dirname, '../src/');

async function command(command) {
    try {
        const { stdout, stderr } = await execAsync(command, {
        cwd: path.join('dist', 'app'),
        encoding: 'utf-8'
        });

        if (stderr) {
        console.warn('Avertissement:', stderr);
        }

        return stdout.trim();

    } catch (error) {
        console.error('Erreur lors de l\'exécution:', error);
        throw error;
    }
}

async function download(url, name) {
    console.log(url)
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Node.js script)',
            'Accept': 'application/octet-stream'
        }
    });
    if (!response.ok) throw new Error(`Erreur téléchargement: ${response.statusText}`);

    const arrayBuffer = await response.arrayBuffer();
    await fs.promises.writeFile(`${temp_dir}/${name}`, Buffer.from(arrayBuffer));
}


async function unzip(filePath, outpath) {
    await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(unzipper.Extract({ path: outpath }))
          .on('close', resolve)
          .on('error', reject);
    });

    fs.unlinkSync(filePath);
}


async function launch_app() {
  await command("npm i");
  // await command("npm stop");
  await command("npm start");
}

async function app() {

    if (!fs.existsSync(temp_dir)) {
        await fs.promises.mkdir(temp_dir);
    }

    const latest_realise = await fetch('https://api.github.com/repos/silvercore-git/silvernote/releases/latest').then(res => res.json());

    const tag_name = latest_realise.tag_name;
    const base = 'https://github.com/SilverCore-Git/silvernote/releases/download/';
    const tag = tag_name;
    const version = tag.slice(1);
    const front_url = new URL(`${tag}/silvernote-front-${version}.zip`, base).href;
    const front_zipName = `silvernote-front-${version}.zip`;

    await fs.promises.rm(path.join(front_path, 'dist'), { force: true, recursive: true } );

    await download(front_url, front_zipName);
    await unzip(path.join(temp_dir, front_zipName), front_path);

} 

app().catch(err => {
    console.error('Une erreur est survenue : ', err);
})