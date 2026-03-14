<template>

                <div
                    class="absolute inset-0 z-50 w-full h-screen"
                >

                    <div 
                        class="
                            dropdown absolute 
                            right-6 top-12 w-64
                        "
                    >

                        <ul>

                            <li
                                v-for="user in users"
                                class="
                                    flex justify-between items-center flex-row px-2
                                "
                                @click.stop
                            >

                                <div
                                    class="
                                        flex justify-center items-center flex-row
                                        space-x-3
                                    "
                                >

                                    <img 
                                        class="w-8 h-8 rounded-full"
                                        :class="user.isMe 
                                                    ? 'border-2 border-[var(--btn)]'
                                                    : ''
                                        "
                                        :src="user.imageUrl" 
                                    />

                                    <span>{{ user.username }}</span>
                                    <span 
                                        v-if="user.isMe"
                                        class="text-xs -translate-x-3.5 -translate-y-2"
                                    >(Vous)</span>

                                </div>

                                <div>
                                    
                                    <span>
                                        {{ 
                                            user.type == 'visitor' 
                                                ? 'Invité' 
                                                : 'Auteur'
                                        }}
                                    </span>

                                </div>

                            </li>

                            <li 
                                class="flex items-center justify-center"
                                @click.stop="send_share()"
                            >
                                <button 
                                    class="second nohover w-full"
                                >
                                    Ajouter un.e invité.e
                                </button>
                            </li>

                        </ul>

                    </div>

                </div>

</template>

<script lang="ts" setup>
import type { User } from '@/assets/ts/type';


defineProps<{
    users: User[];
    send_share: () => void;
}>();

</script>