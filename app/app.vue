<script lang="ts" setup>
import Splashscreen from './components/Splashscreen.vue';
import { TooltipProvider } from 'reka-ui'
const config = useRuntimeConfig()
</script>

<template>
  <NuxtPwaManifest v-if="config.public.DEV !== 'development'" />
  <Splashscreen />
  <NuxtLayout>
    <TooltipProvider>
      <NuxtPage />
    </TooltipProvider>
  </NuxtLayout>
</template>
