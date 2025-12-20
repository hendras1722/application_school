<script lang="ts" setup>
import { z } from 'zod'
import type { FormSubmitEvent, RadioGroupItem } from '#ui/types'

// 1. Definisi Interface & Tipe Data
interface Option {
  text: string
  isCorrect: boolean
}

interface Question {
  questionText: string
  type: 'pg' | 'essay' | 'pg-kompleks'
  options: Option[]
  essayAnswer?: string
}

const questionTypes: RadioGroupItem[] = [
  { label: 'Pilihan Ganda', value: 'pg' },
  { label: 'Essay', value: 'essay' },
  { label: 'Pilihan Ganda Kompleks', value: 'pg-kompleks' }
]

// 2. Schema Validasi Zod
const questionSchema = z.object({
  questionText: z.string().min(10, 'Soal minimal 10 karakter'),
  type: z.enum(['pg', 'essay', 'pg-kompleks']),
  options: z.array(z.object({
    text: z.string().min(1, 'Teks pilihan tidak boleh kosong'),
    isCorrect: z.boolean()
  })).superRefine((options, ctx) => {
    const hasCorrect = options.some(opt => opt.isCorrect)
    if (!hasCorrect) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Minimal harus ada satu jawaban benar",
      })
    }
  }),
  essayAnswer: z.string().optional()
})

const schema = z.object({
  title: z.string().min(5, 'Judul kuis minimal 5 karakter'),
  questions: z.array(questionSchema).min(1, 'Minimal harus ada 1 pertanyaan')
})

type Schema = z.output<typeof schema>

// 3. State Utama
const getDefaultQuestion = (): Question => ({
  questionText: '',
  type: 'pg',
  options: [
    { text: 'Pilihan 1', isCorrect: true },
    { text: 'Pilihan 2', isCorrect: false }
  ],
  essayAnswer: ''
})

const state = reactive<{ title: string; questions: Question[] }>({
  title: '',
  questions: [getDefaultQuestion()]
})

const form = useTemplateRef('form')

// 4. Fungsi Helper Soal
const addQuestion = () => {
  state.questions.push(getDefaultQuestion())
}

const removeQuestion = (index: number) => {
  if (state.questions.length > 1) {
    state.questions.splice(index, 1)
  }
}

const resetForm = () => {
  state.title = ''
  state.questions = [getDefaultQuestion()]
  form.value?.clear()
}

// 5. Fungsi Helper Opsi & Logika Tipe
const handleTypeChange = (qIndex: number, newType: unknown) => {
  const type = newType as Question['type']
  const q = state.questions[qIndex]
  if (!q) return

  q.type = type

  if (type === 'essay') {
    q.options = [{ text: 'Jawaban Utama', isCorrect: true }]
    q.essayAnswer = ''
  } else if (q.options.length <= 1) {
    q.options = [
      { text: 'Pilihan 1', isCorrect: true },
      { text: 'Pilihan 2', isCorrect: false }
    ]
  }
}

const addOption = (qIndex: number) => {
  const q = state.questions[qIndex]
  if (!q) return
  q.options.push({ text: '', isCorrect: false })
}

const removeOption = (qIndex: number, oIndex: number) => {
  const q = state.questions[qIndex]
  if (!q || q.options.length <= 1) return
  q.options.splice(oIndex, 1)
}

const handleCorrectToggle = (qIndex: number, oIndex: number) => {
  const question = state.questions[qIndex]
  if (!question) return

  if (question.type === 'pg') {
    question.options.forEach((opt, i) => {
      opt.isCorrect = i === oIndex
    })
  }
}

// Helper untuk mencari error path secara type-safe
const getError = (path: string) => {
  return form.value?.errors?.find((e: any) => {
    if (!e?.path) return false
    return Array.isArray(e.path) ? e.path.join('.') === path : e.path === path
  })
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log('Data Kuis Terkirim:', event.data)
}
</script>

<template>
  <UContainer class="py-8 sm:py-12 max-w-5xl">
    <UForm :schema="schema" :state="state" ref="form" class="flex flex-col gap-6" @submit="onSubmit">

      <div class="mb-10">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <div
                class="p-2.5 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 shadow-lg shadow-primary-500/30">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1
                  class="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  <UFormField name="title">
                    <UInput v-model="state.title" placeholder="Judul Soal" size="xl" />
                  </UFormField>
                </h1>
              </div>
            </div>
            <p class="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-2xl">
              Buat dan kelola daftar pertanyaan kuis secara dinamis dengan validasi otomatis
            </p>
          </div>

          <div class="flex items-center gap-2">
            <UBadge color="primary" variant="soft" size="lg" class="px-4 py-2 shadow-sm">
              <span class="font-semibold">{{ state.questions.length }}</span>
              <span class="ml-1.5 text-xs opacity-80">Soal</span>
            </UBadge>
          </div>
        </div>
      </div>

      <div v-for="(question, qIndex) in state.questions" :key="qIndex" class="animate-in">
        <UCard class="transition-all duration-300 hover:shadow-xl border-l-[6px] overflow-hidden" :class="[
          qIndex % 3 === 0 ? 'border-l-primary-500 hover:border-l-primary-600' :
            qIndex % 3 === 1 ? 'border-l-blue-500 hover:border-l-blue-600' :
              'border-l-purple-500 hover:border-l-purple-600'
        ]">
          <template #header>
            <div class="flex justify-between items-center gap-4">
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <div
                  class="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full font-bold text-white shadow-lg"
                  :class="[
                    qIndex % 3 === 0 ? 'bg-gradient-to-br from-primary-500 to-primary-600' :
                      qIndex % 3 === 1 ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                        'bg-gradient-to-br from-purple-500 to-purple-600'
                  ]">
                  {{ qIndex + 1 }}
                </div>
                <div class="min-w-0 flex-1">
                  <h3 class="font-bold text-base sm:text-lg text-gray-800 dark:text-gray-100 truncate">
                    Pertanyaan #{{ qIndex + 1 }}
                  </h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {{ question.type === 'pg' ? 'Pilihan Ganda' : question.type === 'essay' ? 'Essay' : 'PG Kompleks' }}
                  </p>
                </div>
              </div>

              <UButton v-if="state.questions.length > 1" icon="i-heroicons-trash" color="red" variant="soft" size="sm"
                class="flex-shrink-0" @click="removeQuestion(qIndex)">
                <span class="hidden sm:inline">Hapus</span>
              </UButton>
            </div>
          </template>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <!-- Sisi Kiri: Identitas Soal -->
            <div class="space-y-5">
              <div
                class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-5 rounded-xl space-y-4 border border-gray-200 dark:border-gray-700">
                <UFormField label="Isi Pertanyaan" :name="`questions.${qIndex}.questionText`">
                  <UTextarea v-model="question.questionText"
                    placeholder="Tuliskan pertanyaan Anda di sini dengan jelas dan detail..." :rows="5" size="lg" class="w-full" />
                </UFormField>
              </div>

              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <div class="w-1 h-6 bg-gradient-to-b from-primary-500 to-blue-500 rounded-full"></div>
                  <span class="text-sm font-bold text-gray-700 dark:text-gray-300">Tipe Soal</span>
                </div>
                <URadioGroup v-model="question.type" :items="questionTypes" class="grid grid-cols-1 gap-3"
                  @update:model-value="(val) => handleTypeChange(qIndex, val)" />
              </div>
            </div>

            <!-- Sisi Kanan: Jawaban/Opsi -->
            <div class="space-y-5">

              <!-- Render Pilihan Ganda / Kompleks -->
              <div v-if="question.type !== 'essay'" class="space-y-4">
                <div class="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span class="text-sm font-bold text-gray-700 dark:text-gray-300">Pilihan Jawaban</span>
                  </div>
                  <UButton label="Tambah Opsi" variant="soft" icon="i-heroicons-plus" size="xs"
                    @click="addOption(qIndex)" />
                </div>

                <div class="space-y-3 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                  <div v-for="(option, oIndex) in question.options" :key="oIndex"
                    class="group bg-white dark:bg-gray-900 p-3 rounded-lg border-2 transition-all duration-200"
                    :class="option.isCorrect ? 'border-green-400 bg-green-50 dark:bg-green-950/30' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'">
                    <div class="flex items-start gap-3">
                      <div
                        class="flex-shrink-0 mt-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-600 dark:text-gray-400">
                        {{ String.fromCharCode(65 + oIndex) }}
                      </div>

                      <div class="flex-grow">
                        <UFormField :name="`questions.${qIndex}.options.${oIndex}.text`">
                          <UInput v-model="option.text" size="md" placeholder="Tulis opsi jawaban..." />
                        </UFormField>
                      </div>

                      <div class="flex items-center gap-2 pt-1">
                        <USwitch v-model="option.isCorrect" color="success" size="md"
                          @update:model-value="handleCorrectToggle(qIndex, oIndex)" />
                        <UButton icon="i-heroicons-trash" color="error" variant="ghost" size="xs"
                          :disabled="question.options.length <= 1" @click="removeOption(qIndex, oIndex)" />
                      </div>
                    </div>
                  </div>
                </div>

                <p v-if="getError(`questions.${qIndex}.options`)"
                  class="text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5 mt-2">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd" />
                  </svg>
                  Minimal pilih satu jawaban benar
                </p>
              </div>

              <!-- Render Essay -->
              <div v-else class="space-y-4">
                <UFormField label="Kunci Jawaban" :name="`questions.${qIndex}.essayAnswer`">
                  <div class="space-y-4">
                    <UInput v-model="question.essayAnswer" placeholder="Kata kunci atau frasa penting dari jawaban..."
                      icon="i-heroicons-key" size="lg" />
                 
                  </div>
                </UFormField>
              </div>

            </div>
          </div>
        </UCard>
      </div>

      <div
        class="sticky bottom-4 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-5 shadow-2xl">
        <div class="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
          <UButton label="Tambah Pertanyaan" variant="soft" color="primary" icon="i-heroicons-plus-circle" size="lg"
            class="flex-1 sm:flex-none font-semibold" @click="addQuestion" />

          <div class="flex gap-3">
            <UButton label="Reset" variant="outline" color="neutral" size="lg" icon="i-heroicons-arrow-path"
              @click="resetForm" />
            <UButton type="submit" label="Simpan Kuis" color="primary" icon="i-heroicons-check-circle" size="lg"
              class="px-6 font-bold shadow-lg shadow-primary-500/30" />
          </div>
        </div>
      </div>
    </UForm>
  </UContainer>
</template>

<style scoped>
.animate-in {
  animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 999px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #475569;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>