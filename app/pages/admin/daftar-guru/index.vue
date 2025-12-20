<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui';
import FormModal from './_components/FomModal.vue';
import DetailModal from './_components/DetailModal.vue';
import type { ListTeacher } from '~/pages/admin/daftar-guru/_type/list';

const columns: TableColumn<any>[] = [
  {
    accessorKey: '_id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    header: 'Nama'
  },
  {
    accessorKey: 'class',
    header: 'Wali Kelas'
  },
  {
    accessorKey: 'status',
    header: 'Status'
  },
  {
    id: 'action'
  }
]

const isOpen = ref(false)
const isOpenDetail = ref(false)
const detailData = ref<ListTeacher | null>(null)

const router = useRouter()

const { data: getData } = useHttp<ListTeacher[]>('/api/teacher/list')
const list = computed(() => getData.value)

function onDetail(data: ListTeacher) {
  detailData.value = data
  isOpenDetail.value = true
  router.replace(`?id=${data.idTeacher}`)
}
</script>

<template>
  <AdminContainer>
    <h1 class="text-2xl font-bold">Daftar Guru</h1>
    <USeparator class="my-5" />
    <div class="flex gap-5 justify-between items-center">
      <UInput placeholder="Cari Nama Guru..." />
      <UButton label="Tambah Guru" color="primary" icon="lucide:user-plus" @click="isOpen = true" />
    </div>
    <UTable :columns="columns" :data="list">
      <template #action-cell="{ row }">
        <UButton label="Detail" @click="onDetail(row.original)" />
      </template>
      <template #status-cell="{ row }">
        <UBadge :label="row.original.status" class="capitalize"
          :color="row.original.status.toLowerCase() === 'active' ? 'success' : 'error'" />
      </template>
    </UTable>
    <FormModal v-model:is-open="isOpen" />
    <DetailModal v-model:is-open="isOpenDetail" label="Detail Guru" :data="list" />
  </AdminContainer>
</template>
