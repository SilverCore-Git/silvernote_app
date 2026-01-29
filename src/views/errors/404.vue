<template>

    <div
        class="
            min-h-dvh w-full
            flex items-center justify-center
            overflow-hidden bg
        "
    >

        <div class="absolute top-[-10%] left-[-10%] w-64 h-64 bg-(--btn)/10 rounded-full blur-3xl" />
        <div class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-(--btn)/10 rounded-full blur-3xl" />

        <div class="w-full z-10 text-center px-6 flex justify-center items-center flex-col">

            <div class="relative mb-8 inline-block">
                <h1 class="text-[12vh] sm:text-[12rem] font-black leading-none text-(--text)/40 select-none">
                    404
                </h1>
            </div>

            <div class="space-y-3 mb-10">
                <h2 class="text-3xl font-bold text-(--text)/80 tracking-tight">
                    Page égarée...
                </h2>
                <p class="text-(--text)/50 max-w-sm mx-auto leading-relaxed">
                    Cette page n'existe pas ou a été déplacée vers une autre dimension.
                </p>
            </div>

            <div class="grid sm:grid-cols-2 grid-cols-1 gap-4 my-2 w-full max-w-xl">

                <button 
                    @click="$router.back()" 
                    class="default-primary w-full"
                >
                    <i class="bi bi-arrow-left mr-2" />
                    Retour
                </button>
                
                <button 
                    @click="$router.push({ name: 'Home' })" 
                    class="primary w-full shadow-lg shadow-orange-500/20"
                >
                    Mes notes
                </button>
                
            </div>

        </div>

    </div>
    
</template>

<style scoped>

.bg {
  background-image: url('/assets/img/sign-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
}


</style>
