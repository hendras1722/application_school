<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui';
import z from 'zod';
import type { ListAnnouncement } from './_type/list'

const items = ref(['all', 'X', 'XI', 'XII'])
const data = ref<ListAnnouncement[]>([])

const schema = z.object({
  to: z.string().min(1, {message: 'Harus ada penerima'}),
  message: z.string().min(1, {message: 'Pesan tidak boleh kosong'})
})

const state = ref({
  to: '',
  message: ''
})
const { data: dataList, execute } = await useHttp<ListAnnouncement[]>('/api/announcement/list', {
  method: 'GET',
  immediate: false
})
const getData = computed(() => dataList.value ?? [])

await execute()

const handleSubmit = async (data: FormSubmitEvent<z.output<typeof schema>>) => {
  const { error } = await useHttp('/api/announcement/create', {
    method: 'POST',
    body: data.data
  })
  if(!error.value){
    await execute()
    state.value = {
      to: '',
      message: ''
    }
  }
}
</script>

<template>
  <div class="px-6">
    <AdminContainer>
      <div class="grid grid-cols-2 grid-rows-1 gap-4">
        <UForm :schema="schema" @submit="handleSubmit" :state="state" class="flex flex-col gap-2">
          <UFormField label="Penerima" name="to">
            <USelectMenu class="w-full" v-model="state.to" :items="items" />
          </UFormField>
          <UFormField label="Pesan Pengumuman" name="message">
            <UTextarea class="w-full" v-model="state.message" />
          </UFormField>
          <UButton type="submit">Kirim</UButton>
        </UForm>
        <div class="flex flex-col gap-2 h-full">
          <div>Pengumuman</div>
          <USeparator />
          <div class="flex-1 min-h-0 overflow-auto flex flex-col gap-2">
            <div v-for="note in getData" :key="note._id"
              class="p-3 border-l-4 border-primary-500 bg-primary-50 dark:bg-primary-900/10 rounded-r-lg">
              <p class="text-sm text-gray-700 dark:text-gray-300">{{ note.message }}</p>
              <span class="text-[10px] text-gray-400 mt-1 block">{{ note.to }}</span>
            </div>
          </div>
        </div>
      </div>

    </AdminContainer>
  </div>
  </template>