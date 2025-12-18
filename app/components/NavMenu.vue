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
  collapsed: {
    type: Boolean,
    default: false
  },
  openMenus: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['toggle']);

const route = useRoute();

const isOpen = computed({
  get: () => props.openMenus[props.item.id] || false,
  set: (value) => {
    emit('toggle', props.item.id, value);
  }
});

const isActive = computed(() => {
  const checkActive = (menuItem: any) => {
    const selfActive =
      menuItem.to && (route.path === menuItem.to || route.path.startsWith(`${menuItem.to}/`));
    if (selfActive) {
      return true;
    }
    if (menuItem.children) {
      return menuItem.children.some((child) => checkActive(child));
    }
    return false;
  };
  return checkActive(props.item);
});

const getMenuClasses = computed(() => {
  if (isActive.value) {
    return 'bg-primary/80 text-white';
  }
  if (isOpen.value) {
    return 'bg-primary/80 text-white';
  }
  return 'text-gray-700 hover:bg-gray-100 hover:text-gray-900';
});

const animationClass = computed(() => {
  return isOpen.value ? 'animate-slideDown' : 'animate-slideUp';
});

function toggle() {
  isOpen.value = !isOpen.value;
}

function handleChildToggle(menuId, value) {
  emit('toggle', menuId, value);
}
</script>

<template>
  <div>
    <button
      v-if="item.children"
      class="group w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 mb-1"
      :class="[getMenuClasses]"
      :style="{ paddingLeft: `${depth * 12 + 12}px` }"
      @click="toggle"
    >
      <div class="flex items-center min-w-0 flex-1">
        <span
          v-if="depth > 0"
          class="w-2 h-2 rounded-full mr-3 flex-shrink-0"
          :class="isActive ? 'bg-primary/80' : 'bg-gray-400 group-hover:bg-gray-500'"
        />
        <UIcon v-else-if="item.icon" :name="item.icon" class="w-5 h-5 mr-3 flex-shrink-0" />
        <span
          class="truncate"
          :class="{
            'lg:opacity-0 lg:w-0': collapsed && depth === 0
          }"
        >
          {{ item.label }}
        </span>
      </div>
      <UIcon
        v-if="item.children && !collapsed"
        name="i-heroicons-chevron-down"
        class="w-4 h-4 transition-transform duration-200 flex-shrink-0"
        :class="[{ 'rotate-180': isOpen }]"
      />
    </button>

    <NuxtLink
      v-else
      :to="item.to"
      class="group w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200"
      :class="[getMenuClasses]"
      :style="{ paddingLeft: `${depth * 12 + 12}px` }"

    >
      <div class="flex items-center min-w-0 flex-1">
        <span
          v-if="depth > 0"
          class="w-2 h-2 rounded-full mr-3 flex-shrink-0"
          :class="isActive ? 'bg-primary/80' : 'bg-gray-400 group-hover:bg-gray-500'"
        />
        <UIcon v-else-if="item.icon" :name="item.icon" class="w-5 h-5 mr-3 flex-shrink-0" />
        <span
          class="truncate"
          :class="{
            'lg:opacity-0 lg:w-0': collapsed && depth === 0
          }"
        >
          {{ item.label }}
        </span>
      </div>
    </NuxtLink>

    <div
      v-if="item.children && isOpen && !collapsed"
      class="space-y-1 overflow-hidden"
      :class="animationClass"
    >
      <NavMenu
        v-for="(child, index) in item.children"
        :key="index"
        :item="child"
        :depth="depth + 1"
        :collapsed="collapsed"
        :open-menus="openMenus"
        @toggle="handleChildToggle"
      />
    </div>
  </div>
</template>

<style scoped>
@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 1000px;
  }
}

@keyframes slideUp {
  from {
    opacity: 1;
    max-height: 1000px;
  }
  to {
    opacity: 0;
    max-height: 0;
  }
}

.animate-slideDown {
  animation: slideDown 0.3s ease-out forwards;
}

.animate-slideUp {
  animation: slideUp 0.3s ease-out forwards;
}
</style>
