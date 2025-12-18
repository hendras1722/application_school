<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui';
import FormModal from './_components/FormModal.vue';

const isOpen = ref(false)
const data = ref<any[]>([
  {
    id: 1,
    name: 'Lindsay Walton',
    position: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member',
    class: 10,
    status: 'Active'
  },
  {
    id: 2,
    name: 'Courtney Henry',
    position: 'Designer',
    email: 'courtney.henry@example.com',
    role: 'Admin',
    class: 10,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Tom Cook',
    position: 'Director of Product',
    email: 'tom.cook@example.com',
    role: 'Member',
    class: 10,
    status: 'Active'
  },
  {
    id: 4,
    name: 'Whitney Francis',
    position: 'Copywriter',
    email: 'whitney.francis@example.com',
    role: 'Admin',
    class: 10,
    status: 'Active'
  },
  {
    id: 5,
    name: 'Leonard Krasner',
    position: 'Senior Designer',
    email: 'leonard.krasner@example.com',
    role: 'Owner',
    class: 10,
    status: 'Active'
  },
  {
    id: 6,
    name: 'Floyd Miles',
    position: 'Principal Designer',
    email: 'floyd.miles@example.com',
    role: 'Member',
    class: 10,
    status: 'Active'
  }
])

const columns: TableColumn<any>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    header: 'Nama'
  },
  {
    accessorKey: 'Kelas',
    header: 'class'
  },
  {
    accessorKey: 'status',
    header: 'Status'
  },
  {
    id: 'action'
  }
]
</script>

<template>
  <AdminContainer>
    <h1 class="text-2xl font-bold">Daftar Siswa</h1>
    <USeparator class="my-5" />
    <div class="flex gap-5 justify-between items-center">
      <UInput placeholder="Cari Nama Siswa..." />
      <UButton label="Tambah Siswa" color="primary" icon="lucide:user-plus" />
    </div>
    <UTable :columns="columns" :data="data">
      <template #action-cell>
        <UButton label="Detail" @click="isOpen = true"/>
      </template>
    </UTable>
    <FormModal v-model:is-open="isOpen"/>
  </AdminContainer>
</template>
