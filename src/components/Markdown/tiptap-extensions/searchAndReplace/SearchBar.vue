<template>

    <Teleport to="body">

        <div
            class="fixed inset-0 flex justify-end items-start mx-[var(--mrl)] mt-18 pointer-events-none"
        >

            <transition name="fade">

                    <div
                        v-if="visible"
                        class="relative z-50 pointer-events-auto"
                        @keydown.esc="emitClose"
                    >

                        <div
                            class="relative max-w-md bg-[var(--bg2)] rounded-2xl 
                            shadow-xl p-2 flex items-center gap-3 border border-gray-400"
                        >
                        
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                                />
                            </svg>

                            <input
                                v-model="searchTerm"
                                type="search"
                                placeholder="Rechercher dans la note..."
                                class="flex-1 bg-transparent focus:outline-none text-base"
                                autofocus
                            />

                            <a
                                @click="emitClose"
                                class="px-1"
                                title="Fermer (Échap)"
                            >
                                ✖
                            </a>

                        </div>

                    </div>

            </transition>

        </div>

    </Teleport>

</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue"
import { searchTerm } from "./index"

defineProps<{
  visible: boolean
}>()

const emit = defineEmits(["update:visible"])

const emitClose = () => emit("update:visible", false)

const handleKey = (e: KeyboardEvent) => {
  if (e.key === "Escape") emitClose()
}

onMounted(() => window.addEventListener("keydown", handleKey))
onUnmounted(() => window.removeEventListener("keydown", handleKey))

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
