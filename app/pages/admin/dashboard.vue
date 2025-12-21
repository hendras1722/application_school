<script setup lang="ts">
import type { ListAnnouncement } from '~/pages/admin/pengumuman/_type/list'
import FormModal from './daftar-siswa/_components/FormModal.vue'
import { formatIntlDate } from '~~/shared/utils/formatDate'
import type { Schedules } from '~/pages/admin/mata-pelajaran/_type/list'

const auth = useAuth()
const listDay = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

const isOpenAdd = ref(false)

const student = ref({
  name: 'Budi Santoso',
  nisn: '0012345678',
  photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
  attendanceToday: true, // Hardcoded
  grades: [80, 85, 78, 92, 88, 95, 89], // Data untuk grafik
  notes: [
    { id: 1, text: 'Tugas Matematika halaman 45 dikumpulkan besok.', date: '2023-10-24' },
    { id: 2, text: 'Bawa baju olahraga hari Kamis.', date: '2023-10-25' },
    { id: 3, text: 'Persiapan ujian tengah semester bulan depan.', date: '2023-10-26' }
  ]
})

// const chartData = computed(() =>
//   student.value.grades.map((value, index) => ({
//     label: `Ujian ${index + 1}`,
//     value
//   }))
// )


const { data: dataList, execute: executeAnnouncement } = await useHttp<ListAnnouncement[]>('/api/announcement/list', {
  method: 'GET',
  immediate: false,
})
const { data: scheduleList, execute: executeSchedule } = await useHttp<Schedules[]>('/api/schedule/list', {
  method: 'GET',
  params: {
    class: auth?.profile?.data?.class
  }
})

if (auth?.user?.role === 'student'){
  await executeAnnouncement()
}
const getDataAnnouncement = computed(() => dataList.value ?? [])

// const categories = computed(() =>
//   chartData.value.map(item => item.label)
// )

// const chartOptions = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     legend: {
//       display: false
//     }
//   },
//   scales: {
//     y: {
//       beginAtZero: true,
//       max: 100,
//       grid: {
//         display: false
//       }
//     },
//     x: {
//       grid: {
//         display: false
//       }
//     }
//   }
// }

async function refetch() {
  const updateUser = await $fetch<{ data: Record<string, any> }>('/api/student/single', {
    method: 'POST',
    body: {
      idSiswa: auth.user?._id
    }
  })
  auth.setProfile(updateUser)
  executeSchedule()
}
</script>

<template>
  <UContainer>
    <template v-if="auth.profile.data === null">
      <UAlert color="error" variant="subtle" title="Hallooo"
        description="Oooopps kamu belum terdaftar di aplikasi yuk daftar dulu" icon="i-lucide-terminal" />
      <UButton @click="isOpenAdd = true" color="primary" icon="i-lucide-plus" label="Tambah Siswa" class="mt-4"/>
      <FormModal @refetch="refetch" v-model:open="isOpenAdd" label="Daftar" />
    </template>
    <template v-else>
      <div
        class="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-4">
          <!-- <UAvatar :src="student.photo" :alt="student.name" size="xl" class="ring-2 ring-primary-500" /> -->
          <div>
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white">{{ auth.profile.data?.name }}</h1>
            <p class="text-gray-500 dark:text-gray-400 text-sm">NISN: {{ auth.profile.data?.nisn }} | Kelas {{ auth.profile.data?.class }}</p>
            <div class="font-semibold"><span class="text-gray-500">Wali Kelas:</span> {{ auth.profile.data?.teacher?.name }}</div>
          </div>
        </div>
  
        <div class="flex flex-col items-end gap-2">
          <div class="text-right">
            <span class="text-sm text-gray-500 block mb-1">Status Kehadiran Hari Ini:</span>
            <UBadge :color="student.attendanceToday ? 'primary' : 'secondary'" variant="subtle" size="lg" class="px-4 py-1">
              <UIcon :name="student.attendanceToday ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" class="mr-1" />
              {{ student.attendanceToday ? 'Hadir' : 'Absen' }}
            </UBadge>
          </div>
        </div>
      </div>
  
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
  
        <div class="lg:col-span-2 space-y-6">
  
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-lg">Grafik Kemajuan Nilai</h3>
              </div>
            </template>
  
            <div class="h-64">
              <!-- <BarChart :data="chartData" :categories="chartData.map(d => d.label)" x-axis="label" :y-axis="['value']"
                :height="256" /> -->
                <div>Coming soon</div>
            </div>
          </UCard>
  
          <UCard>
            <template #header>
              <h3 class="font-semibold text-lg">Jadwal Pelajaran Seminggu</h3>
            </template>
            <div class="flex gap-4 overflow-auto">
              <div class="flex flex-col items-center px-5" v-for="(schedule, index) in listDay" :key="index + schedule">
                <div>{{ schedule }}</div>
                <USeparator class="my-2" />
                <ul class="list-disc">
                  <li v-for="(value, index) in scheduleList?.filter((item) => item.name === schedule)" :key="index" class="flex flex-col gap-2">{{ value.course }} <span class="text-xs text-slate-500">{{ value.fromTime }} - {{ value.toTime }}</span></li>
                </ul>
              </div>
            </div>
          </UCard>
        </div>
  
        <div class="space-y-6">
  
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-pencil-square" class="text-primary-500" />
                <h3 class="font-semibold">Notif dari Guru</h3>
              </div>
            </template>
            <div class="space-y-4 max-h-[200px] overflow-y-auto">
              <div v-for="note in getDataAnnouncement" :key="note._id"
                class="p-3 border-l-4 border-primary-500 bg-primary-50 dark:bg-primary-900/10 rounded-r-lg">
                <p class="text-sm text-gray-700 dark:text-gray-300">{{ note.message }}</p>
                <span class="text-[10px] text-gray-400 mt-1 block">{{ note.to }} - {{ formatIntlDate(note.created_at, 'dd MMMM yyyy, HH:mm') }}</span>
              </div>
              <!-- <UButton label="Tambah Catatan" variant="ghost" icon="i-heroicons-plus" block size="sm" /> -->
            </div>
          </UCard>
  
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-primary-600 p-4 rounded-xl text-white shadow-lg shadow-primary-500/20">
              <p class="text-xs opacity-80">Sikap</p>
              <p class="text-2xl font-bold">B</p>
            </div>
            <div class="bg-primary-600 p-4 rounded-xl text-white shadow-lg shadow-primary-500/20">
              <p class="text-xs opacity-80">Absensi</p>
              <p class="text-2xl font-bold">B</p>
            </div>
          </div>
        </div>
  
      </div>
    </template>
  </UContainer>
</template>