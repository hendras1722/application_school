<script lang="ts" setup>
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
const route = useRoute()
const router = useRouter()

const dataDetail = ref<ListTeacher | null>(null)

const isOpen = defineModel('isOpen', {
  type: Boolean,
  default: false
})

async function getDetail(id: string) {
  const { data } = await useHttp<ListTeacher>(`/api/teacher/detail/list?id=${id}`)
  dataDetail.value = data.value ?? null
}

watchEffect(() => {
  if (route.query.id) {
    getDetail(route.query.id as string)
  }
})

watch(isOpen, (newValue) => {
  if (!newValue) {
    router.replace(route.fullPath.replace(`?id=${route.query.id}`, ''))
  }
}, {
  deep: true
})
</script>

<template>
  <UModal v-model:open="isOpen" :title="label" class="min-w-[200px] max-w-[600px]">
    <template #body>
      <div class="flex flex-col gap-4">
        <div class="flex gap-2 flex-col">
          <div class="font-semibold text-sm">Nama:</div>
          <div>{{ dataDetail?.name }}</div>
        </div>
        <div class="flex gap-2 flex-col">
          <div class="font-semibold text-sm">Wali Kelas:</div>
          <div>{{ dataDetail?.class }}</div>
        </div>
        <div class="flex gap-2 flex-col">
          <div class="font-semibold text-sm">No. Handphone:</div>
          <div>{{ dataDetail?.phone }}</div>
        </div>
        <div class="flex gap-2 flex-col">
          <div class="font-semibold text-sm">Email:</div>
          <div>{{ dataDetail?.email }}</div>
        </div>
        <div class="flex gap-2 flex-col">
          <div class="font-semibold text-sm">Status:</div>
          <UBadge :label="dataDetail?.status" class="capitalize w-fit"
            :color="dataDetail?.status.toLowerCase() === 'active' ? 'success' : 'error'" />
        </div>
      </div>
    </template>
  </UModal>
</template>