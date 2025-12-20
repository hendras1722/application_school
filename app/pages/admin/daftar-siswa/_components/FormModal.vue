<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'
import type { ListTeacher } from '~/pages/admin/daftar-guru/_type/list'

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
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  class: z.string().min(1, 'Kelas required'),
  address: z.string().min(3, 'Alamat minimal 3 karakter'),
  email: z.string().email(),
  phone: z.string().min(10, 'No. Hp minimal 10 karakter'),
  parent_name: z.string().min(3, 'Nama Orang tua minimal 3 karakter'),
  parent_phone: z.string().min(10, 'No. Hp Orang tua minimal 10 karakter'),
  homeroom_teacher: z.string().min(1, 'Wali kelas required'),
  nisn: z.string().min(1, 'NISN required'),
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
  parent_name: '',
  parent_phone: '',
  homeroom_teacher: '',
  nisn: ''
})

const { data: getData } = useHttp<ListTeacher[]>('/api/teacher/list')
const list = computed(() => getData.value)

watch(auth, (newValue) => {
  if(newValue.user?.role === 'student'){
    state.value.email = auth.user?.email ?? ''
  }
}, {
  immediate: true
})

async function submit(data: FormSubmitEvent<z.output<typeof schema>>) {
  const { error, execute } = await useHttp('/api/student/create', {
    method: 'POST',
    body: {
      ...data.data,
      idSiswa: auth.user?._id,
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
      parent_name: '',
      parent_phone: '',
      homeroom_teacher: '',
      nisn: ''
    }
  }
}

</script>

<template>
  <UModal v-model:open="isOpen" :title="label">
    <template #body>
      <UForm class="flex flex-col gap-5" :schema="schema" @submit="submit" :state="state">
        <UFormField label="NISN" name="nisn">
          <UInput class="w-full" v-model="state.nisn" placeholder="Masukkan nisn"/>
        </UFormField>
        <UFormField label="Nama" name="name">
          <UInput class="w-full" v-model="state.name" placeholder="Masukkan nama"/>
        </UFormField>
        <UFormField label="Kelas" name="class">
          <USelect v-model="state.class" :items="['X', 'XI', 'XII']" class="w-full" placeholder="Pilih kelas"/>
        </UFormField>
        <UFormField label="Wali Kelas" name="homeroom_teacher">
          <USelect v-model="state.homeroom_teacher" :items="list" class="w-full" placeholder="Pilih wali kelas" label-key="name" value-key="idTeacher"/>
        </UFormField>
        <UFormField label="Alamat" name="address">
          <UTextarea :rows="4" class="w-full" v-model="state.address" placeholder="Masukkan alamat"/>
        </UFormField>
        <UFormField label="Email" name="email">
          <UInput class="w-full" v-model="state.email" :disabled="auth.user?.role === 'student'"/>
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