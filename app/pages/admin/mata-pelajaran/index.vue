<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui';
import ModalCurriculum from './_components/ModalCurriculum.vue';
import type { ListCurriculum,Schedules } from '~/pages/admin/mata-pelajaran/_type/list';
import ModalSchedule from './_components/ModalSchedule.vue';
import { groupBy } from '~~/shared/utils/groupBy';

const isOpen = ref(false)
const isOpenSchedule = ref(false)
const listDay = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
const { data: getData, execute} = useHttp<Schedules[]>('/api/schedule/list')
const list = computed(() => groupBy(getData.value ?? [], 'name'))
</script>

<template>
  <AdminContainer>
    <h1 class="text-2xl font-bold">Mata Pelajaran</h1>
    <USeparator class="my-5" />
    <div class="flex gap-5 justify-end items-center">
      <UButton label="Tambah Mata Pelajaran" color="secondary" icon="lucide:book" @click="isOpen = true"/>
      <UButton label="Tambah Jadwal" color="primary" icon="lucide:calendar" @click="isOpenSchedule = true" />
    </div>
    <div class="flex justify-center items-start gap-5 mt-10 flex-wrap">
      <div v-for="(item, index) in listDay" :key="index" class="border border-slate-300 shadow-lg rounded-lg px-8 py-2 w-[400px]">
        <div class="text-center">{{ item }}</div>
        <USeparator class="my-2" />
        <ul class="list-disc wrap-break-word mt-4">
          <li v-for="(value, index) in list[item]" :key="index">{{ value.course }}/({{ value.class }}) <span class="text-xs text-slate-500" v-if="value.fromTime && value.toTime">| {{ value.fromTime }} - {{ value.toTime }}</span></li>
        </ul>
      </div>
    </div>

    <ModalCurriculum v-model:open="isOpen" label="Tambah Mata Pelajaran" />
    <ModalSchedule v-model:open="isOpenSchedule" label="Tambah Jadwal" @refetch="execute" />
  </AdminContainer>
</template>
