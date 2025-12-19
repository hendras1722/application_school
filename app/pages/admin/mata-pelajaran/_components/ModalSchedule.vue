<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'
import type { ListCurriculum } from '~/pages/admin/mata-pelajaran/_type/list'

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
  name: z.string().nonempty('day is required'),
  class: z.string().nonempty('class is required'),
  course: z.string().nonempty('course is required'),
  fromTime: z.string().nonempty('from time is required'),
  toTime: z.string().nonempty('to time is required'),
})

const isOpen = defineModel('isOpen', {
  type: Boolean,
  default: false
})

const state = ref<{ name: string, class: string, course: string, fromTime: string, toTime: string }>({
  name: '',
  class: '',
  course: '', 
  fromTime: '07:00',
  toTime: '07:00',
})

async function submit(data: FormSubmitEvent<z.output<typeof schema>>) {
  const { error, execute } = await useHttp('/api/schedule/create', {
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
      course: '',
      fromTime: '07:00',
      toTime: '07:00',
    }
  }
}

const getClass = computed(() => state.value.class)
const { data: getData, execute } = useHttp<ListCurriculum[]>(`/api/curriculum/list`, {
  immediate: false,
  params: {
    class: getClass
  }
})

watch(state, (newValue) => {
  if(newValue.class){
    execute()
  }
}, {
  deep: true
})


</script>

<template>
  <UModal v-model:open="isOpen" :title="label">
    <template #body>
      <UForm class="flex flex-col gap-5" :schema="schema" @submit="submit" :state="state" :validate-on="['input', 'change']">
        <UFormField label="Hari" name="name">
         <USelect v-model="state.name" :items="['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']" class="w-full" placeholder="Pilih hari"/>
        </UFormField>
         <UFormField label="Kelas" name="class">
          <USelect v-model="state.class" :items="['X', 'XI', 'XII']" class="w-full" placeholder="Pilih kelas" />
        </UFormField>
        <UFormField label="Mata Pelajaran" name="course">
          <USelect :disabled="!state.class" v-model="state.course" :items="getData" class="w-full" placeholder="Pilih mata pelajaran" value-key="name" label-key="name"/>
        </UFormField>
        <UFormField label="Dari" name="fromTime">
          <BaseTime class="w-full" v-model="state.fromTime" />
        </UFormField>
        <UFormField label="Ke" name="toTime">
          <BaseTime class="w-full" v-model="state.toTime" :min="state.fromTime" />
        </UFormField>
        <UButton label="Simpan" color="primary" type="submit" />
      </UForm>
    </template>
  </UModal>
</template>