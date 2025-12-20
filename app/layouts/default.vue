<script setup>
import { dataManagementMenu, settingsMenu } from '~/const/menu';

const {
  sidebarClasses,
  sidebarStyles,
  mainContentClasses,
  mainContentStyles,
  startResize,
  handleMenuToggle,
  openMenus,
  sidebarCollapsed
} = useControlSidebar();

// const route = useRoute()

</script>

<template>
  <div class="h-screen bg-gray-50 flex overflow-hidden">
    <aside :class="[
      sidebarClasses,
      'flex flex-col h-full'
    ]" :style="sidebarStyles">
      <div class="flex items-center h-16 px-4 border-b border-gray-200">
        <div
          class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
        >
          <span class="text-white font-bold text-sm">D</span>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto px-2 py-4 space-y-2">
        <div v-if="!sidebarCollapsed">
          <div class="space-y-1">
            <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
             Menu
            </h3>
            <NavMenu
              v-for="item in dataManagementMenu"
              :key="item.id"
              :item="item"
              :collapsed="sidebarCollapsed"
              :open-menus="openMenus"
              @toggle="handleMenuToggle"
            />
          </div>
        </div>

        <div v-else class="space-y-2">
          <PopOverMenu v-for="item in dataManagementMenu" :key="item.id" :item="item" />
          <div class="pt-2 mt-2 border-t border-gray-200">
            <PopOverMenu v-for="item in settingsMenu" :key="item.id" :item="item" />
          </div>
        </div>
      </nav>

      <div
        v-if="!sidebarCollapsed"
        class="absolute right-0 top-0 bottom-0 w-1 bg-transparent hover:bg-blue-500 cursor-col-resize transition-colors group"
        @mousedown="startResize"
      />
    </aside>

    <div
      v-show="!sidebarCollapsed"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity"
      @click="sidebarCollapsed = true"
    />

    <div  :class="[mainContentClasses, 'flex flex-col h-full flex-1']" :style="mainContentStyles">
      <header
        class="bg-white shadow-sm border-b border-gray-200 h-16 items-center justify-between px-4 flex"
      >
        <div class="flex items-center space-x-4">
          <UButton
            icon
            variant="ghost"
            aria-label="Toggle sidebar"
            @click="sidebarCollapsed = !sidebarCollapsed"
          >
            <UIcon name="i-heroicons-bars-3-16-solid" />
          </UButton>

          <nav class="flex items-center space-x-2 text-sm text-gray-600">
            <a href="#" class="hover:text-blue-600 transition-colors">Dashboard</a>
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="text-gray-900 font-medium">Form</span>
          </nav>
        </div>

        <div class="flex items-center space-x-4">
          <button
            aria-label="notification"
            class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
              />
            </svg>
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <div
            class="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center"
          >
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto py-6">
        <!-- <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"> -->
          <slot />
        <!-- </div> -->
      </main>
    </div>
  </div>
</template>
