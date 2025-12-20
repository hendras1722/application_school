<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'

const props = defineProps<{
  modelValue?: string
  min?: string // Format "HH:mm"
  max?: string // Format "HH:mm"
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

const hour = ref('')
const minute = ref('')

const parseTime = (timeStr?: string) => {
  if (!timeStr || !timeStr.includes(':')) return null
  const [h, m] = timeStr.split(':').map(Number)
  return { h, m }
}

const isHourDisabled = (hStr: string) => {
  const h = Number(hStr)
  const minTime = parseTime(props.min)
  const maxTime = parseTime(props.max)

  if (minTime && h < (minTime.h ?? 0)) return true
  if (maxTime && h > (maxTime.h ?? 0)) return true
  return false
}

const isMinuteDisabled = (mStr: string) => {
  const m = Number(mStr)
  const h = Number(hour.value)
  const minTime = parseTime(props.min)
  const maxTime = parseTime(props.max)

  if (minTime && h === minTime.h && m < (minTime.m ?? 0)) return true
  if (maxTime && h === maxTime.h && m > (maxTime.m ?? 0)) return true

  if (isHourDisabled(hour.value)) return true

  return false
}

const syncInternalState = (val?: string) => {
  if (val && val.includes(':')) {
    const [h, m] = val.split(':')
    hour.value = h || ''
    minute.value = m || ''
  } else {
    hour.value = ''
    minute.value = ''
  }
}

syncInternalState(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  syncInternalState(newVal)
})

watch([hour, minute], () => {
  const newValue = `${hour.value}:${minute.value}`
  if (newValue !== props.modelValue) {
    emit('update:modelValue', newValue)
  }
})

const scrollToSelected = () => {
  nextTick(() => {
    const panel = document.querySelector('.time-picker-panel')
    if (panel) {
      const activeButtons = panel.querySelectorAll('.bg-primary-500')
      activeButtons.forEach(btn => {
        btn.scrollIntoView({ block: 'center', behavior: 'smooth' })
      })
    }
  })
}

const setHour = (h: string) => {
  if (isHourDisabled(h)) return
  hour.value = h

  nextTick(() => {
    if (isMinuteDisabled(minute.value)) {
      const minTime = parseTime(props.min)
      const maxTime = parseTime(props.max)
      if (minTime && Number(hour.value) === minTime.h) {
        minute.value = minTime.m?.toString().padStart(2, '0') ?? ''
      } else if (maxTime && Number(hour.value) === maxTime.h) {
        minute.value = maxTime.m?.toString().padStart(2, '0') ?? ''
      }
    }
  })
}

const setMinute = (m: string) => {
  if (isMinuteDisabled(m)) return
  minute.value = m
}
</script>

<template>
  <UPopover :popper="{ placement: 'bottom-start', strategy: 'fixed' }" :ui="{
    content: 'relative w-full',
   arrow: 'w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-transparent border-b-black dark:border-b-white',
  }">
    <UInput readonly :model-value="`${hour}:${minute}`" icon="i-heroicons-clock" class="cursor-pointer w-full"
      placeholder="Pilih Waktu" @click="scrollToSelected" />

    <template #content>
      <div
        class="time-picker-panel flex gap-1 p-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <div class="flex flex-col">
          <span class="text-[10px] font-bold uppercase text-gray-400 px-2 mb-1">Jam</span>
          <div
            class="max-h-48 w-16 overflow-y-auto rounded-md border border-gray-100 dark:border-gray-800 scrollbar-thin">
            <button v-for="h in hours" :key="h" type="button" :disabled="isHourDisabled(h)"
              class="w-full px-2 py-2 text-sm transition-colors focus:outline-none disabled:opacity-20 disabled:cursor-not-allowed"
              :class="[
                h === hour ? 'bg-primary-500 text-white font-bold' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              ]" @click="setHour(h)">
              {{ h }}
            </button>
          </div>
        </div>

        <div class="flex flex-col">
          <span class="text-[10px] font-bold uppercase text-gray-400 px-2 mb-1">Menit</span>
          <div
            class="max-h-48 w-16 overflow-y-auto rounded-md border border-gray-100 dark:border-gray-800 scrollbar-thin">
            <button v-for="m in minutes" :key="m" type="button" :disabled="isMinuteDisabled(m)"
              class="w-full px-2 py-2 text-sm transition-colors focus:outline-none disabled:opacity-20 disabled:cursor-not-allowed"
              :class="[
                m === minute ? 'bg-primary-500 text-white font-bold' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              ]" @click="setMinute(m)">
              {{ m }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </UPopover>
</template>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background: #334155;
}
</style>