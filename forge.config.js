const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const { AutoUnpackNativesPlugin } = require('@electron-forge/plugin-auto-unpack-natives');

module.exports = {

  packagerConfig: {
    asar: true,
    icon: 'resources/icons', // => npm run icon
  },
  rebuildConfig: {},

  makers: [

    // Windows Squirrel installer
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'silvernote',
        authors: 'SilverCore',
        exe: 'silvernote.exe',
        setupExe: 'silvernote-setup.exe',
        setupIcon: 'resources/icons/win/icon.ico',
        loadingGif: 'resources/loading.gif',   // gif animé affiché pendant l'installation
        noMsi: true,                       // désactive la génération du MSI
        //remoteReleases: null,              // URL des mises à jour
        //certificateFile: '',               // fichier certificat pour signer l'installeur
        //certificatePassword: '',           // mot de passe certificat
      },
    },

    // macOS DMG installer
    {
      name: '@electron-forge/maker-dmg',
      platforms: ['darwin'],
      config: {
        //background: '', // image de fond DMG png
        icon: 'resources/icons/mac/icon.icns',                 // icône macOS .icns
        format: 'ULFO',                           // format DMG (ULFO par défaut, plus rapide)
        overwrite: true,                         // écrase le fichier dmg existant
        debug: false,                           // affiche des logs de debug
        window: { width: 600, height: 400 },    // taille fenêtre au montage du dmg
        contents: [
          { x: 410, y: 220, type: 'link', path: '/Applications' },     // raccourci vers Applications
        ],
      },
    },

    // Debian package
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          maintainer: 'SilverCore <contact@silvercore.fr>',  // mainteneur du package
          homepage: 'https://www.silvercore.fr',                 // site web de ton projet
          icon: 'resources/png/256x256.png',                          // icône PNG pour Debian
          categories: ['Utility'],                          // catégorie(s) dans menu
          depends: ['libc6', 'libgcc1', 'libstdc++6'],     // dépendances Debian
          priority: 'optional',
          description: 'Silvernote est une app de prise de note simple, intuitive et hergonomique. Projet open source et francais.',   // description dans le package
          packageName: 'silvernote',                        // nom du package Debian
          productName: 'Silvernote',                        // nom affiché
        },
      },
    },

    // RPM package => redhat linux
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          maintainer: 'SilverCore <contact@silvercore.fr>',
          homepage: 'https://www.silvercore.fr',
          icon: 'resources/png/256x256.png',
          categories: ['Utility'],
          requires: ['glibc', 'libgcc', 'libstdc++'],
          description: 'Silvernote est une app de prise de note simple, intuitive et hergonomique. Projet open source et francais.',
          packageName: 'silvernote',
          productName: 'Silvernote', 
        },
      },
    },

  ],
  plugins: [
    new AutoUnpackNativesPlugin(),
    {
      name: '@electron-forge/plugin-fuses',
      config: {
        version: FuseVersion.V1,
        [FuseV1Options.RunAsNode]: false,
        [FuseV1Options.EnableCookieEncryption]: true,
        [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
        [FuseV1Options.EnableNodeCliInspectArguments]: false,
        [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
        [FuseV1Options.OnlyLoadAppFromAsar]: true,
      },
    }, // test rebuild sans plugin fuse
  ],
};
