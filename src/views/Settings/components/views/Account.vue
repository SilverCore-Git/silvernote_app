<script setup lang="ts">
import { UserProfile } from '@clerk/vue';

const appearanceSettings = {
  variables: {
    colorPrimary: "var(--btn)",
    colorText: "var(--text)",
    colorBackground: "var(--bg)",
    colorBorder: "var(--shadow)",
    colorButtonPrimaryBackground: "var(--btn)",
    colorButtonPrimaryText: "var(--white)",
    colorButtonPrimaryHoverBackground: "var(--btn-hover)",
    colorInputBackground: "var(--bg2)",
    colorInputBorder: "var(--shadow)",
    colorInputText: "var(--text-strong)",
    colorLinkText: "var(--btn)",
  },
  elements: {
    buttonBorderRadius: "var(--br-btn)",
    inputBorderRadius: "var(--br-main)",
    cardBorderRadius: "var(--br-card)"
  }
};


</script>

<template>
    
    <h1 class="font-bold text-3xl mb-4">
        Paramettre du compte
    </h1>
    
    <UserProfile 
        :appearance="appearanceSettings"
    />





</template>