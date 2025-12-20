<script setup lang="ts">
import FormModal from './daftar-siswa/_components/FormModal.vue'

const auth = useAuth()
const isOpenAdd = ref(false)
const { data: getData, execute } = auth.user?.role === 'student' ? useFetch('/api/student/single',{
  params: {
    idSiswa: auth.user?._id
  }
}) : useFetch('/api/teacher/single',{
  params: {
    email: auth.user?.email
  }
})

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

const chartData = computed(() =>
  student.value.grades.map((value, index) => ({
    label: `Ujian ${index + 1}`,
    value
  }))
)

const categories = computed(() =>
  chartData.value.map(item => item.label)
)

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

// Data Jadwal Pelajaran (Senin - Minggu)
const schedule = [
  { day: 'Senin', subjects: 'Matematika, Bahasa Indonesia, Fisika' },
  { day: 'Selasa', subjects: 'Kimia, Sejarah, Olahraga' },
  { day: 'Rabu', subjects: 'Bahasa Inggris, Seni Budaya, Biologi' },
  { day: 'Kamis', subjects: 'Geografi, Ekonomi, Sosiologi' },
  { day: 'Jumat', subjects: 'Agama, PKn, Komputer' },
  { day: 'Sabtu', subjects: 'Ekstrakurikuler, Pramuka' },
  { day: 'Minggu', subjects: 'Libur' }
]

const averageProgress = computed(() => {
  const sum = student.value.grades.reduce((a, b) => a + b, 0)
  return Math.round(sum / student.value.grades.length)
})

const columns = [
  { id: 'day', key: 'day', label: 'Hari', class: 'font-bold w-32' },
  { id: 'subjects', key: 'subjects', label: 'Mata Pelajaran' }
]

async function refetch() {
  const updateUser = await $fetch('/api/user', {
    method: 'POST',
    body: {
      email: auth.user?.email
    }
  })
  auth.setUser(updateUser)
  await execute()
}
</script>

<template>
  <UContainer>
    <!-- {{ auth }} -->
    <template v-if="!auth?.profile">
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
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white">{{ auth.profile.name }}</h1>
            <p class="text-gray-500 dark:text-gray-400 text-sm">NISN: {{ auth.profile.class }} | Kelas 12-A</p>
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
                <span class="text-primary-600 font-bold">Rata-rata: {{ averageProgress }}%</span>
              </div>
            </template>
  
            <div class="h-64">
              <BarChart :data="chartData" :categories="chartData.map(d => d.label)" x-axis="label" :y-axis="['value']"
                :height="256" />
            </div>
          </UCard>
  
          <UCard>
            <template #header>
              <h3 class="font-semibold text-lg">Jadwal Pelajaran Seminggu</h3>
            </template>
            <UTable :columns="columns" :rows="schedule">
              <template #day-data="{ row }">
                <span :class="row.day === 'Minggu' ? 'text-red-500' : 'text-primary-600 font-medium'">
                  {{ row.day }}
                </span>
              </template>
            </UTable>
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
            <div class="space-y-4">
              <div v-for="note in student.notes" :key="note.id"
                class="p-3 border-l-4 border-primary-500 bg-primary-50 dark:bg-primary-900/10 rounded-r-lg">
                <p class="text-sm text-gray-700 dark:text-gray-300">{{ note.text }}</p>
                <span class="text-[10px] text-gray-400 mt-1 block">{{ note.date }}</span>
              </div>
              <UButton label="Tambah Catatan" variant="ghost" icon="i-heroicons-plus" block size="sm" />
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