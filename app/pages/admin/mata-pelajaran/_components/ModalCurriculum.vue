<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

defineProps({
  label: {
    type: String,
    default: 'Form',
    required: true
  },
  data: {
    type: Object,
    default: () => ({}),
  }
})

const emits = defineEmits(['refetch'])

const schema = z.object({
  name: z.string().nonempty('Required'),
  class: z.string().nonempty('Required'),
})


const isOpen = defineModel('isOpen', {
  type: Boolean,
  default: false
})

const state = ref({
  name: '',
  class: '',
})


async function submit(data: FormSubmitEvent<z.output<typeof schema>>) {
  const { error, execute } = await useHttp('/api/curriculum/create', {
    method: 'POST',
    body: {
      ...data.data,
    },
    watch: false,
    immediate: false
  })
  await execute()
  if (!error.value) {
    isOpen.value = false
    emits('refetch')
    state.value = {
      name: '',
      class: '',
    }
  }
}

</script>

<template>
  <UModal v-model:open="isOpen" :title="label">
    <template #body>
      <UForm class="flex flex-col gap-5" :schema="schema" @submit="submit" :state="state">
        <UFormField label="Mata Pelajaran" name="name">
          <UInput class="w-full" v-model="state.name" />
        </UFormField>
        <UFormField label="Kelas" name="class">
         <USelect v-model="state.class" :items="['X', 'XI', 'XII']" class="w-full" placeholder="Pilih kelas"/>
        </UFormField>
        <UButton label="Simpan" color="primary" type="submit" />
      </UForm>
    </template>
  </UModal>
</template>