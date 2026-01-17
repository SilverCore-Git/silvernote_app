<template>

    <div
        class="fixed z-40 inset-x-0 top-0 h-30 pointer-events-none"
        style="background: linear-gradient(to top, transparent 0%, var(--bg2) 100%);"
    ></div>

    <header
        class="
            flex justify-center items-center flex-row
            fixed inset-x-4 top-8 z-50 
            md:inset-x-[10%] xl:inset-x-[20%]
            2xl:inset-x-[25vw]
        "
    >

        <div
            class="
                flex justify-between items-center
            "
        >

            <BackBtn />

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
                        class="w-8 h-8  rounded-full border-1 border-gray-200"
                        :src="user.imageUrl"
                    />

                </div>

                <a 
                    class="px-2 rounded"
                    :class="share_menu ? 'bg-gray-200 ' : ''"
                    @click="share_menu = !share_menu"
                >Partage</a>

            </div>



            <transition name="fade-slide">
                    
                <Dropdown
                    v-if="share_menu"
                    @click="share_menu = false"
                    :users="users"
                    :send_share="send_share"
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
                v-if="note && note.tags"
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
                        v-if="note.icon" 
                        class="w-20 h-20 p-2 cursor-pointer" 
                        :src="note.icon" 
                    />

                    <a 
                        v-else
                        class="px-1"
                    >
                        Ajouter une icon
                    </a>

                </a></button>

                <!-- <div
                    v-else
                    @click="tagManager = true"
                >
                    <a class="px-1">Ajouter un tag</a>
                </div> -->
                
                </div>

            </div>

            <div
                class="w-full h-full flex justify-center items-center flex-col"
            >

                <input 
                    v-if="note"
                    class="
                        text-4xl font-extrabold mb-4 
                        text-(--text-strong) w-[90%]
                        outline-0
                    " 
                    type="text" 
                    placeholder="Titre..." 
                    ref="title"
                    v-model="note.title"
                    @keydown.enter="editor?.commands.focus()"
                />

                <RichMarkdownEditor
                    v-if="note"
                    :editable="true"
                    :id="-2" 
                    :uuid="note.uuid"
                    :data="note"
                />

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
                        class="py-1 rounded-xl bg-[var(--bg2)]/80 border border-[#F28C28]/40 focus:border-[#F28C28] outline-none transition"
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
                        @click="_fetch()"
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
            class="bg-[var(--bg2)] rounded-2xl shadow-xl p-6 m-4 w-full max-w-md text-sm border border-gray-300 dark:border-zinc-700"
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

    <Success
        v-if="_success?.active"
        :value="_success.value"
    />

</template>

<script lang="ts" setup>

import { api_url } from '@/assets/ts/backend_link';
import type { Note, User } from '@/assets/ts/type';
import { useUser } from '@clerk/vue';
import RichMarkdownEditor from '@/components/Markdown/RichMarkdownEditor.vue';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { io, Socket } from 'socket.io-client';
import { EmojiButton } from '@joeattardi/emoji-button';
import Success from '@/components/alert/Success.vue';
import utils from '@/assets/ts/utils';
import Popup from '@/components/popup/Popup.vue';
import BackBtn from '@/components/backBtn.vue';
import { editor } from '@/components/Markdown/Editor';
import Dropdown from './components/dropdown.vue';


const props = defineProps<{
    uuid: string;
}>()

const router = useRouter();
const { user } = useUser();


const note = ref<Note | undefined>(undefined);
const error = ref<string>('');
const need_passwd = ref<boolean>(false);
const loaded = ref<boolean>(false);
const passwd = ref<string>('');
const emojiBtn = ref<HTMLButtonElement | null>(null);
const users = ref<User[]>([]);
const share_menu = ref<boolean>(false);
const _success = ref<{ active: boolean, value: string }>({ active: false, value: '' });

let editable: boolean;
let socket: Socket;


const getUserByUUID = async (user_id: string, type: 'owner' | 'visitor'): Promise<User | undefined> => {

    if (!user_id || !type) return;

    const data = await fetch(`${api_url}/api/user/by/id/${user_id}`, {
        credentials: 'include'
    }).then(res => res.json());

    return { ...data, type };

}
 
const saveTitle = () => {
    socket.emit('edit_note', { 
        uuid: note.value?.uuid,
        content: note.value?.content,
        title: note.value?.title
    })
}

const send_share = async (): Promise<void> => {

    const send_text: string = "Je te partage ma note :\n" + window.location.href;

    if (navigator.share) {

        try {
            await navigator.share({
                title: "Je te partage ma note !",
                text: send_text,
                url: window.location.href,
            });
        } catch (err) {
            console.error("Erreur de partage :", err);
        }

    } else {
        navigator.clipboard.writeText(window.location.href);
        _success.value.value = 'Lien de partage copier !';
        _success.value.active = true;

        setTimeout(() => {
            _success.value.active = false;
        }, 6000)
    }

}

let req: number = 0;
const _fetch = async () => {

    const _share = await fetch(`${api_url}/api/share/${props.uuid}?passwd=${passwd.value}`, { 
        credentials: 'include'
    }).then(res => res.json());

    if (_share.error) {
        error.value = _share.message;
        loaded.value = true;
        return;
    }

    if (_share.expired) {
        error.value = 'Ce partage à expiré.';
        loaded.value = true;
        return;
    }

    if (_share.success) {

        note.value = _share.note;
        need_passwd.value = false;
        editable = _share.editable;

        const owner_user: User | undefined = await getUserByUUID(_share.user_id, 'owner');
        if (owner_user) users.value.push(owner_user);

        loaded.value = true;
        wSocket();


        if (_share.visitor.length > 0) {
            const usersFetched = await Promise.all(
                _share.visitor
                .filter((id: string) => id != _share.user_id)
                .map((id: string) => getUserByUUID(id, 'visitor'))
            );

            users.value.push(
                ...usersFetched.filter((u): u is User => Boolean(u))
            );
        }


        return;

    }

    if (_share.need == 'passwd') {
        req++;
        need_passwd.value = true;
        loaded.value = true;
        if (req > 1) error.value = 'Mot de passe incorect.';
        return;
    }

    if (_share.banned) {
        error.value = 'Vous êtes bannis de ce partage.';
        loaded.value = true;
        return;
    }

}


const init = () => {

    if (!emojiBtn.value) return console.error('Emoji pîcker not load.');

    const picker = new EmojiButton({
      position: 'bottom-start',
      autoHide: true,
      showPreview: true
    });

    picker.on('emoji', (emoji: { emoji: string, name: string }) => {
        if (!editable || !note.value?.icon) return;
        note.value.icon = utils.emojiToBase64(emoji.emoji);
    });

    emojiBtn.value.addEventListener('click', () => {
        if (!editable) return;
        picker.togglePicker(emojiBtn.value!);
    });

}


const wSocket = () => {

    socket = io(
      api_url == 'http://localhost:3000'
        ? 'http://localhost:3434'
        : api_url, 
      { path: "/socket.io/share" }
    );

    socket.on('connect', () => {
        console.log('WebSocket connecté !');
        socket.emit("join-room", { 
          room: note.value?.uuid, 
          userId: user.value?.id
        });
    });

    socket.on('new_user', async (userId: string) => {

        if (userId == user.value?.id) return;

        const user_visitor = await getUserByUUID(userId, 'visitor');
        const user_owner = await getUserByUUID(userId, 'owner');

        if (!user_owner || !user_visitor) return;
        if (users.value.includes(user_visitor)) return;
        if (users.value.includes(user_owner)) return;

        if (!users.value.includes(user_visitor) && !users.value.includes(user_owner)) 
        {
          users.value.push(user_visitor);
        }

    })

    let ignoreNextUpdate: boolean = false;
    socket.on('title-update', (update: string) => {
      ignoreNextUpdate = true;
      if (note.value) note.value.title = update;
    });

    socket.on('icon-update', async (update: string) => {
        note.value!.icon = update;
    })

    socket.on('disconnect', () => {
        console.log('WebSocket déconnecté !');
    });

    watch(
      () => note.value?.title,
      (newTitle) => {

        if (ignoreNextUpdate) {
          ignoreNextUpdate = false;
          return;
        }

        debounceEmit(newTitle);

      }
    );

    let timeout: any;
    function debounceEmit(title?: string) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        socket.emit('title-update', title);
      }, 500);
    }

    watch(() => note.value?.icon, () => {
      socket.emit('icon-update', note.value?.icon);
    })

};


onMounted(() => {
    _fetch().then(() => init());
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

</style>
