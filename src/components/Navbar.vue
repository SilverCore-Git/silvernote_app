<script setup lang="ts">
import navbar_config from "../config/navbar_config.json";
import SButton from "./SButton.vue";

const navbar_btn = navbar_config.btn;

const button_contact = () => {
    window.location.href = navbar_btn.href;
};
</script>

<template>
            <div 
                class="
                        fixed top-6 inset-x-[10%] 2xl:inset-x-[20%] z-50
                        rounded-[7px] flex justify-between items-center 
                        border border-gray-400/50 bg-black/70 backdrop-blur-sm
                    "

            >
                <div
                    class="center justify-around cursor-pointer ml-[25px]"

                >
                    <img 
                        class="h-[38px]"
                        :src="navbar_config.logo" alt=""
                    
                    >
                    <h3 class="ml-[8px] Heading_4">{{ navbar_config.title }}</h3>
                </div>

                <div 
                    class="center my-[5px]"

                >

                    <a 
                            v-for="Nav in navbar_config.tab"
                            class="text-white p-[15px] text-white cursor-pointer Body_XS"
                            :href="Nav.href"
                        
                    >{{ Nav.name }}</a>

                </div>

                <!-- <button
                    @click="button_contact"
                    class="btn_basic center mr-[25px]"
                    :href="btn.href"
                
                >{{ btn.content }}</button> -->

                <SButton
                    :content= "navbar_btn.content"
                    :href="navbar_btn.href"
                    class="mr-[25px]"
                />
            </div>

</template>


<style scoped></style>