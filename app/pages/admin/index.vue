<script lang="ts" setup>
import { useUserStore } from '~/stores/user';

await nextTick();
const user = toRef(useUserStore());
// const { setUser, user } = mapStore(useUserStore, ['user', 'setUser'])
const input = ref('');
function handleSave() {
  console.log(user, 'iniuser');
  if (user.value.$state.user) return true;
}
</script>

<template>
  <div>
    Hello world {{ user.name }}
    <UInput v-model="input" />
    <UButton label="Save" @click="handleSave" />
  </div>
</template>
