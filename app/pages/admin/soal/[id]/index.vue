<script lang="ts" setup>
import type { RadioGroupItem } from '@nuxt/ui';

const items = ref<RadioGroupItem[]>(['this is item 1', 'this is item 2', 'this is item 3'])
const selected = ref('this is item 1')

</script>

<template>
  <AdminContainer>
    <div class="flex flex-col gap-4">
      <h1>Judul Soal</h1>

      <USeparator />

      <div>
        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa, minima ab facilis eius quia, atque ullam
          cumque accusantium voluptatum tempora necessitatibus excepturi ut. Culpa, necessitatibus. Libero ut placeat
          sed obcaecati?</div>

        <div class="mt-4">
          <URadioGroup :items="items" v-model="selected" disabled  />
        </div>
      </div>

    </div>
  </AdminContainer>

</template>
