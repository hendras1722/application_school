<script setup lang="ts">
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  depth: {
    type: Number,
    default: 0
  },
  parentClose: {
    type: Function,
    default: null
  }
});

const route = useRoute();

const isActive = computed(() => {
  if (!props.item.to) return false;
  return route.path === props.item.to || route.path.startsWith(`${props.item.to}/`);
});

const getMenuClasses = computed(() => {
  if (isActive.value) {
    return 'bg-primary/80 text-white';
  }
  return 'text-gray-700 hover:bg-gray-100 hover:text-gray-900';
});

function handleLinkClick() {
  if (props.parentClose) {
    props.parentClose();
  }
}
</script>

<template>
  <div class="">
    <UPopover
      v-if="item.children"
      mode="click"
      class="px-3"
      :content="{
        align: 'center',
        side: 'right',
        sideOffset: 8
      }"
      arrow
    >
      <button
        class="group w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 mb-1"
        :class="[getMenuClasses]"
      >
        <div class="flex items-center min-w-0 flex-1">
          <UIcon
            v-if="item.icon && depth === 0"
            :name="item.icon"
            class="w-5 h-5 mr-3 flex-shrink-0"
          />
          <span
            v-if="depth > 0"
            class="w-2 h-2 rounded-full mr-3 flex-shrink-0"
            :class="isActive ? 'bg-primary' : 'bg-gray-400'"
          />
          <span class="truncate">{{ item.label }}</span>
        </div>
        <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 ml-2 flex-shrink-0" />
      </button>

      <template #content>
        <div class="bg-white rounded-lg shadow-xl py-2 px-2 min-w-[220px] max-w-[300px]">
          <div v-if="depth === 0" class="px-4 py-2 border-b border-gray-100">
            <p class="text-sm font-semibold text-gray-900">
              {{ item.label }}
            </p>
          </div>

          <div class="py-1 max-h-[400px] overflow-y-auto">
            <PopOverMenu
              v-for="child in item.children"
              :key="child.id"
              :item="child"
              :depth="depth + 1"
            />
          </div>
        </div>
      </template>
    </UPopover>

    <NuxtLink
      v-else
      :to="item.to"
      class="group w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 mb-1"
      :class="[getMenuClasses]"
      @click="handleLinkClick"
    >
      <UIcon v-if="item.icon && depth === 0" :name="item.icon" class="w-5 h-5 mr-3 flex-shrink-0" />
      <span
        v-if="depth > 0"
        class="w-2 h-2 rounded-full mr-3 flex-shrink-0"
        :class="isActive ? 'bg-primary' : 'bg-gray-400'"
      />
      <span class="truncate">{{ item.label }}</span>
    </NuxtLink>
  </div>
</template>
