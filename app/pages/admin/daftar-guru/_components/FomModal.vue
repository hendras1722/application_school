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
const formRef = useTemplateRef('formRef')

const schema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  class: z.string().min(1, 'Kelas required'),
  address: z.string().min(3, 'Alamat minimal 3 karakter'),
  email: z.string().email(),
  phone: z.string().min(10, 'No. Hp minimal 10 karakter'),
  role: z.union([z.literal('teacher'), z.literal('admin'), z.string()]),
  nik: z.string().min(5, 'NIK minimal 5 karakter'),
})

const auth = useAuth()

const isOpen = defineModel('isOpen', {
  type: Boolean,
  default: false
})

const state = ref({
  name: '',
  class: '',
  address: '',
  email: '',
  phone: '',
  role: '',
  nik: ''
})

async function submit(data: FormSubmitEvent<z.output<typeof schema>>) {
  const { error, execute } = await useHttp('/api/teacher/create', {
    method: 'POST',
    body: {
      ...data.data,
      status: 'Active'
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
      address: '',
      email: '',
      phone: '',
      role: '',
      nik: ''
    }
  }
}

</script>

<template>
  <UModal v-model:open="isOpen" :title="label">
    <template #body>
      <UForm ref="formRef" class="flex flex-col gap-5" :schema="schema" @submit="submit" :state="state">
        <UFormField label="Nama" name="name">
          <UInput class="w-full" v-model="state.name" placeholder="Masukkan nama" />
        </UFormField>
        <UFormField label="NIK" name="nik">
          <UInput class="w-full" v-model="state.nik" placeholder="Masukkan NIK" />
        </UFormField>
        <UFormField label="Akses sebagai" name="role">
          <USelect v-model="state.role"
            :items="[{ label: 'Guru', value: 'teacher' }, { label: 'Admin Guru', value: 'admin' }]" class="w-full"
            value-key="value" label-key="label" placeholder="Pilih kelas" />
        </UFormField>
        <UFormField label="Wali Kelas" name="class">
          <USelect :disabled="state.role !== 'admin'" v-model="state.class" :items="['X', 'XI', 'XII']" class="w-full" placeholder="Pilih kelas" />
        </UFormField>
        <UFormField label="Alamat" name="address">
          <UTextarea :rows="4" class="w-full" v-model="state.address" placeholder="Masukkan alamat" />
        </UFormField>
        <UFormField label="Email" name="email">
          <UInput class="w-full" v-model="state.email"  />
        </UFormField>
        <UFormField label="No. Hp" name="phone">
          <UInput class="w-full" v-model="state.phone" />
        </UFormField>
        <UButton label="Simpan" color="primary" type="submit" />
      </UForm>
    </template>
  </UModal>
</template>