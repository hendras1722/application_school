<script lang="ts" setup>
import Splashscreen from './components/Splashscreen.vue';

const config = useRuntimeConfig()
</script>

<template>
  <NuxtPwaManifest v-if="config.public.DEV !== 'development'" />
  <Splashscreen />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
