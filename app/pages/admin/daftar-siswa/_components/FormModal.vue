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

const schema = z.object({
  name: z.string().min(3),
  class: z.string().min(3),
  address: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10),
  parent_name: z.string().min(3),
  parent_phone: z.string().min(10),
})

const auth = useAuth()

const isOpen = defineModel('isOpen', {
  type: Boolean,
  default: false
})

const formRef = useTemplateRef('formRef')

const state = ref({
  name: '',
  class: '',
  address: '',
  email: '',
  phone: '',
  parent_name: '',
  parent_phone: ''
})

watch(auth, (newValue) => {
console.log(newValue,'inivalue')
  state.value.email = auth.user?.email ?? ''
}, {
  immediate: true
})

async function submit(data: FormSubmitEvent<z.output<typeof schema>>) {
  alert('wewe')
  const { error, execute } = await useFetch('/api/student/create', {
    method: 'POST',
    body: data.data,
    watch: false,
    immediate: false
  })
  await execute()
  if(!error){
    isOpen.value = false
    state.value = {
      name: '',
      class: '',
      address: '',
      email: '',
      phone: '',
      parent_name: '',
      parent_phone: ''
    }
  }
}

</script>

<template>
  <UModal v-model:open="isOpen" :title="label">
    <template #body>
      {{ formRef?.errors }}
      <UForm ref="formRef" class="flex flex-col gap-5" :schema="schema" @submit="submit" :state="state">
        <UFormField label="Nama" name="name">
          <UInput class="w-full" v-model="state.name" />
        </UFormField>
        <UFormField label="Kelas" name="class">
          <UInput class="w-full" v-model="state.class" />
        </UFormField>
        <UFormField label="Alamat" name="address">
          <UTextarea :rows="4" class="w-full" v-model="state.address" />
        </UFormField>
        <UFormField label="Email" name="email">
          <UInput class="w-full" v-model="state.email" disabled/>
        </UFormField>
        <UFormField label="No. Hp" name="phone">
          <UInput class="w-full" v-model="state.phone" />
        </UFormField>
        <USeparator />
        <UFormField label="Nama Orang tua" name="parent_name">
          <UInput class="w-full" v-model="state.parent_name" />
        </UFormField>
        <UFormField label="No. Hp Orang tua" name="parent_phone">
          <UInput class="w-full" v-model="state.parent_phone" />
        </UFormField>
        <UButton label="Simpan" color="primary" type="submit"/>
      </UForm>
    </template>
  </UModal>
</template>