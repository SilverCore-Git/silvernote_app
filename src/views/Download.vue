<template>

    <nav class="absolute h-21 top-0 left-0 w-screen z-50 bg-[var(--bg2)] flex justify-center items-center">

        <Nav_bar />

    </nav>

    <header class="mt-40 w-screen text-center">
        <h1 class="uppercase text-9xl font-extrabold">Télécharger silvernote</h1>
		<span>version {{ version }}</span>
    </header>


    <main  class="px-10 py-20 max-w-4xl mx-auto text-left text-lg space-y-8 text-[var(--text)] mb-1">

		<Loader v-if="loader" :icon="false" />

        <div v-if="!loader" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">

            <Download_card

				v-for="(truc, index) in platform_list"
				:key="index"

                :platform="truc.platform"
                :platformName="truc.platformName"
                :downloadLink="truc.downloadLink"
                :buttonText="truc.buttonText"
				:svgbg="truc.svg"
				:linux_props="truc?.linux_props"

            />

        </div>

    </main>

    <footer class="z-50 w-screen">
        <Footer />
    </footer>

</template>

<script lang="ts" setup>

import { onMounted, ref } from 'vue';
import Nav_bar from '../components/Nav_bar.vue';
import Footer from '../components/Footer.vue';
import Download_card from '../components/Download_card.vue';
import Loader from '../components/Loader.vue';

const version = ref<string>('v-1');
const loader = ref<boolean>(true);

// let win_url: string | undefined;
// let macos_url: string | undefined;
// let linux_appimage_url: string | undefined;
// let linux_deb_url: string | undefined;
// let linux_rpm_url: string | undefined;

let platform_list = ref<{ 
    platform: string;
    platformName: string;
    downloadLink: string | undefined;
    buttonText: string;
    svg: string;
	linux_props?: { 
		is: boolean, 
		appimage: string | undefined, 
		deb: string | undefined, 
		rpm: string | undefined 
	};
}[] | undefined>(undefined);

onMounted(async () => {

	try {

		const repo = await fetch('https://api.github.com/repos/silvercore-git/silvernote/releases/latest')
		.then(res => {
			return res.json() as Promise<{ tag_name: string; assets_url: string; }>;
		});

		version.value = repo.tag_name;

		// const assets = await fetch(repo.assets_url)
		// 	.then(res => {
		// 		return res.json() as Promise<{ name: string; browser_download_url: string; }[]>;
		// 	});

		// win_url = assets.find(asset => asset.name.includes('win-setup.exe'))?.browser_download_url;

		// macos_url = assets.find(asset => asset.name.includes('macos.dmg'))?.browser_download_url;

		// linux_appimage_url = assets.find(asset => asset.name.includes('linux-setup.AppImage'))?.browser_download_url;
		// linux_deb_url = assets.find(asset => asset.name.includes('linux-setup.deb'))?.browser_download_url;
		// linux_rpm_url = assets.find(asset => asset.name.includes('linux-setup.rpm'))?.browser_download_url;

	}
	catch (err) {
		console.error('Une erreur est survenue on get download link :', err);
	}

	platform_list.value = [
		// {
		// 	platform: 'windows',
		// 	platformName: 'Windows',
		// 	downloadLink: await win_url,
		// 	buttonText: 'Télécharger pour PC',
		// 	svg: '/assets/svg/windows.svg',
		// },
		// {
		// 	platform: 'macos',
		// 	platformName: 'macOS',
		// 	downloadLink: await macos_url,
		// 	buttonText: 'Télécharger pour Mac',
		// 	svg: '/assets/svg/apple.svg',
		// },
		// {
		// 	platform: 'android',
		// 	platformName: 'Android',
		// 	downloadLink: "https://a_mettre_dans_app_store",
		// 	buttonText: 'Obtenir sur Play Store',
		// 	svg: '/assets/svg/android.svg',
		// },
		// {
		// 	platform: 'ios',
		// 	platformName: 'iOS',
		// 	downloadLink: "https://a_mettre_dans_app_store",
		// 	buttonText: "Obtenir sur l'App Store",
		// 	svg: '/assets/svg/apple.svg', 
		// },
		{
			platform: 'web',
			platformName: 'Version Web',
			downloadLink: 'https://app.silvernote.fr',
			buttonText: "Lancer l'application web",
			svg: '/assets/svg/web.svg', 
		},
		// {
		// 	platform: 'linux',
		// 	platformName: 'Linux',
		// 	downloadLink: '',
		// 	linux_props: {
		// 		is: true,
		// 		deb: await linux_deb_url,
		// 		appimage: await linux_appimage_url,
		// 		rpm: await linux_rpm_url
		// 	},
		// 	buttonText: 'Télécharger pour Linux',
		// 	svg: '/assets/svg/linux.svg',
		// },
	];

	loader.value = false;

})




</script>
