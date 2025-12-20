<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui';
import FormModal from './_components/FormModal.vue';
import type { ListSiswa } from '~/pages/admin/daftar-siswa/_type/list';
import DetailModal from './_components/DetailModal.vue';


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
    header: 'Kelas'
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
const detailData = ref<ListSiswa | null>(null)

const router = useRouter()

const { data: getData } = useHttp<ListSiswa[]>('/api/student/list')
const list = computed(() => getData.value)
const auth = useAuth()

function onDetail(data: ListSiswa){
  detailData.value = data
  isOpenDetail.value = true
  router.replace(`?id=${data.idSiswa}`)
}
</script>

<template>
  <AdminContainer>
    <h1 class="text-2xl font-bold">Daftar Siswa</h1>
    <USeparator class="my-5" />
    <div class="flex gap-5 justify-between items-center">
      <UInput placeholder="Cari Nama Siswa..." />
      <UButton v-if="auth?.user?.role === 'admin'" label="Tambah Siswa" color="primary" icon="lucide:user-plus" @click="isOpen = true"/>
    </div>
    <UTable :columns="columns" :data="list">
      <template #action-cell="{row}">
        <UButton label="Detail" @click="onDetail(row.original)"/>
      </template>
      <template #status-cell="{row}">
        <UBadge :label="row.original.status" class="capitalize" :color="row.original.status.toLowerCase() === 'active' ? 'success' : 'error'"/>
      </template>
    </UTable>
    <FormModal v-model:is-open="isOpen"/>
    <DetailModal v-model:is-open="isOpenDetail" label="Detail Siswa" :data="list"/>
  </AdminContainer>
</template>
