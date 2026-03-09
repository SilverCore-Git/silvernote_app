<!-- <template>

<div
    class="
        overflow-y-auto fixed
        inset-0 flex flex-col
        h-full w-full
    "
    :style="{ 'view-transition-name': `note-${uuid}` }"
>

    <div
        class="fixed top-0 inset-x-0 bg-(--bg2) z-9999"
    >
        <DesktopAppTitleBar />
    </div>

    <div
        class="fixed z-40 inset-x-0 h-30 pointer-events-none"
        :class="isElectron ? 'top-10' : 'top-0'"
        style="background: linear-gradient(to top, transparent 0%, var(--bg2) 100%);"
    ></div>

    <div>

        <header
            class="
                flex justify-center items-center flex-row
                fixed inset-x-4 z-50 
                md:inset-x-[10%] xl:inset-x-[20%]
                2xl:inset-x-[25vw]
            "
            :class="isElectron ? 'top-18' : 'top-8'"
        >

            <div
                class="
                    flex justify-between items-center
                "
            >

                <BackBtn href="/?page=shared" />

                <div 
                    class="
                        absolute right-0
                        flex flex-row justify-center items-center
                        space-x-5
                    " 
                >

                    <div
                        class="flex -space-x-3"
                    >

                        <img
                            v-if="users.length > 0"
                            v-for="user in users"
                            class="w-8 h-8  rounded-full border border-gray-200"
                            :src="user.imageUrl"
                        />

                    </div>

                    <button
                        class="px-2 default-primary"
                        :class="share_menu ? 'bg-(--text)/10' : ''"
                        @click="share_menu = !share_menu"
                    >
                        Partage
                    </button>

                </div>



                <transition name="fade-slide">
                        
                    <Dropdown
                        v-if="share_menu"
                        @click="share_menu = false"
                        :users="users"
                        :send_share="sendShare"
                    />
                    
                </transition>

            </div>

        </header>

        <div
            class="
            flex flex-col justify-start items-center 
            overflow-hidden w-screen mt-22
            "
        >

            <div
                class="
                    flex flex-col justify-start items-center 
                    md:max-w-[70vw] lg:max-w-[60vw] xl:max-w-[50vw]
                    2xl:max-w-[40vw] max-w-[90%] w-full h-full
                "
            >

                <div
                    class="w-full h-full flex justify-center items-center"
                    v-if="note"
                >

                    <div 
                        class="flex w-[90%] mb-2 items-end"
                        :class="
                            note?.icon
                                ? 'justify-between' 
                                : 'justify-start gap-2'
                        "  
                    >

                    <button ref="emojiBtn"><a>

                        <img
                            v-if="icon != undefined && note.icon" 
                            class="w-20 h-20 p-2 cursor-pointer" 
                            :src="icon"
                        />

                        <a 
                            v-else
                            class="px-1"
                        >
                            Ajouter une icon
                        </a>

                    </a></button>
                    
                    </div>

                </div>

                <div
                    class="w-full h-full flex justify-center items-center flex-col"
                >

                    <textarea 
                        v-if="title !== undefined"
                        ref="titleRef"
                        v-model="title"
                        class="
                            text-4xl font-extrabold mb-4 
                            text-(--text-strong) w-[90%]
                            outline-0 resize-none
                            overflow-hidden bg-transparent
                            min-h-[1.2em] transition-[height] duration-100
                        "
                        placeholder="Titre..." 
                        rows="1"
                        @input="resizeTitle"
                        @keydown.enter.prevent="editor?.commands.focus()"
                    />

                    <RichMarkdownEditor
                        v-if="note"
                        :editable="editable"
                        :id="-2" 
                        :uuid="note.uuid"
                        :data="note"
                        :is-collaborative="true"
                    />

                    <div
                        v-if="editor"
                        ref=""
                        class="
                            h-80 w-full
                        "
                        @click="editor.commands.focus('end');"
                    ></div>

                </div>

            </div>

        </div>


        <Popup
            v-model:visible="need_passwd"
        >

            <div
                @click.stop
            >

                <h2 class="text-center text-xl font-semibold mb-6">
                    🔒 Saisir le mot de passe
                </h2>

                <div class="flex flex-col gap-6">

                    <div class="rounded-xl p-4 border">

                        <label class="block text-base font-medium mb-2">
                            Mot de passe :
                        </label>

                        <input
                            v-model="passwd"
                            type="password"
                            placeholder="Entrez votre mot de passe..."
                            class="py-1 rounded-xl bg-(--bg2)/80 border border-[#F28C28]/40 focus:border-[#F28C28] outline-none transition"
                        />

                    </div>

                    <p v-if="error" class="text-red-500 text-sm text-center">
                        ❌ {{ error }}
                    </p>

                    <div class="flex justify-end gap-3 mt-4">
                        <button
                            class="primary danger"
                            @click="router.push('/')"
                        >
                            Annuler
                        </button>

                        <button
                            class="primary"
                            @click="verifyPasswd"
                        >
                            Confirmer
                        </button>
                    </div>

                </div>

            </div>

        </Popup>


        <div
            v-if="error !== '' && error !== 'Mot de passe incorect.'"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >

            <div
                class="bg-(--bg2) rounded-2xl shadow-xl p-6 m-4 w-full max-w-md text-sm border border-gray-300 dark:border-zinc-700"
            >
                <h2 class="text-2xl font-semibold text-red-600 dark:text-red-500 mb-4">
                    {{ error }}
                </h2>

                <div class="flex flex-col gap-5">

                    <div class="flex justify-end gap-3 mt-6">

                        <button
                            class="primary"
                            @click="router.push('/')"
                        >
                            Accueil
                        </button>

                    </div>

                </div>

            </div>

        </div>

    </div>

    <Success
        v-if="_success?.active"
        :value="_success.value"
    />

</div>

</template>

<script lang="ts" setup>

import type { Note, User } from '@/assets/ts/type';
import RichMarkdownEditor from '@/components/Markdown/RichMarkdownEditor.vue';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import Success from '@/components/alert/Success.vue';
import Popup from '@/components/popup/Popup.vue';
import BackBtn from '@/components/backBtn.vue';
import { editor } from '@/components/Markdown/Editor';
import Dropdown from './components/dropdown.vue';
import useEmoji from '../Edit/composable/useEmoji';
import waitFor from '@/assets/ts/utils/waitFor';
import useSendShare from './composable/useSendShare';
import useInitShare from './composable/useInitShare';
import DesktopAppTitleBar from '@/components/DesktopAppTitleBar.vue';
import isElectron from '@/assets/ts/utils/isElectron';
import { useWSocket } from '@/composables/WSocket';


const props = defineProps<{
    uuid: string;
}>()

const router = useRouter();
const { init_emoji_picker } = useEmoji();
const { sendShare, initUseShare, isSuccess, successMessage } = useSendShare();
const { init, verifyPasswd } = useInitShare();

const note = ref<Note | undefined>(undefined);
const error = ref<string>('');
const need_passwd = ref<boolean>(false);
const loaded = ref<boolean>(false);
const passwd = ref<string>('');
const emojiBtn = ref<HTMLButtonElement | null>(null);
const users = ref<User[]>([]);
const share_menu = ref<boolean>(false);
const _success = computed(() => ({ 
    active: isSuccess.value, 
    value: successMessage.value 
}));
const titleRef = ref<HTMLInputElement | undefined>(undefined);
const editable = ref<boolean>(false);
let close: () => void = () => {};
const title = ref<string | undefined>(undefined);
const icon = ref<string | undefined>(undefined);

const resizeTitle = () => {
  const el = titleRef.value;
  if (el) {
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }
};

const initShare = async () => {

    const result = await init(
        props.uuid,
        passwd,
        {
            note,
            users,
            error,
            loaded,
            need_passwd,
            editable,
            title,
            icon
        }
    )

    title.value = note.value?.title;
    icon.value = note.value?.icon;
    
    if (!result) return;
    close = result.closeSocket;
}

watch(title, async () => {
  await nextTick();
  resizeTitle();
});

onMounted(() => {
  resizeTitle();
});

onMounted(async () => {

    await initShare();

    initUseShare(props.uuid)

    await waitFor(() => note.value !== undefined, 5_000);
    if (!note.value) return;

    init_emoji_picker({
        icon,
        note,
        ref: emojiBtn,
    });

})

onUnmounted(async () => {
    close();
    (await useWSocket()).value.emit('leave-room', { room: props.uuid });
})

</script>

<style scoped>

textarea,
input {
  border: none;
  outline: none;
  width: 90%;
  text-decoration: none;
}

</style> -->


<template></template>