<template>
  <div class="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/50">
    <div
      class="relative max-h-full w-full max-w-2xl rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800"
    >
      <!-- Modal header slot -->
      <div
        v-if="$slots.header"
        class="flex items-center justify-between rounded-t border-b border-gray-200 p-4 md:p-5 dark:border-gray-600"
      >
        <slot name="header"></slot>
        <button
          v-if="showCloseButton"
          @click="close"
          class="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            class="h-3 w-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
      </div>
      <!-- Modal body slot -->
      <div v-if="$slots.body" class="space-y-4 p-4 md:p-5">
        <slot name="body"></slot>
      </div>
      <!-- Modal footer slot -->
      <div
        v-if="$slots.footer"
        class="flex items-center rounded-b border-t border-gray-200 p-4 md:p-5 dark:border-gray-600"
      >
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ showCloseButton?: boolean }>();
const emit = defineEmits(["update:visible"]);

const close = () => {
  emit("update:visible", false);
};
</script>
