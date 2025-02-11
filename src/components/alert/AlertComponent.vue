<template>
  <div
    class="mb-4 flex items-center rounded-lg border p-4 text-sm dark:bg-gray-800"
    :class="alertClasses"
    role="alert"
  >
    <svg
      class="me-3 inline h-4 w-4 shrink-0"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
      />
    </svg>
    <span class="sr-only">Alert</span>
    <div>
      <slot>
        {{ message }}
      </slot>
    </div>
    <button
      v-if="closable"
      type="button"
      class="-mx-1.5 -my-1.5 ms-auto inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg p-1.5 transition-colors dark:hover:bg-gray-600 dark:active:bg-gray-700"
      :class="closeButtonClasses"
      @click="$emit('click')"
    >
      <span class="sr-only">Close</span>
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
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  type?: "info" | "danger" | "success" | "warning" | "dark";
  message?: string;
  closable?: boolean;
}>();

const typeClasses = {
  info: [
    "text-blue-800",
    "border-blue-300",
    "bg-blue-50",
    "dark:text-blue-400",
    "dark:border-blue-800",
  ],
  danger: [
    "text-red-800",
    "border-red-300",
    "bg-red-50",
    "dark:text-red-400",
    "dark:border-red-800",
  ],
  success: [
    "text-green-800",
    "border-green-300",
    "bg-green-50",
    "dark:text-green-400",
    "dark:border-green-800",
  ],
  warning: [
    "text-yellow-800",
    "border-yellow-300",
    "bg-yellow-50",
    "dark:text-yellow-300",
    "dark:border-yellow-800",
  ],
  dark: [
    "text-gray-800",
    "border-gray-300",
    "bg-gray-50",
    "dark:text-gray-300",
    "dark:border-gray-600",
  ],
};

const buttonClasses = {
  info: [
    "text-blue-500",
    "hover:bg-blue-200",
    "hover:text-blue-700",
    "active:bg-blue-300",
    "dark:text-blue-400",
    "dark:hover:text-blue-300",
  ],
  danger: [
    "text-red-500",
    "hover:bg-red-200",
    "hover:text-red-700",
    "active:bg-red-300",
    "dark:text-red-400",
    "dark:hover:text-red-300",
  ],
  success: [
    "text-green-500",
    "hover:bg-green-200",
    "hover:text-green-700",
    "active:bg-green-300",
    "dark:text-green-400",
    "dark:hover:text-green-300",
  ],
  warning: [
    "text-yellow-500",
    "hover:bg-yellow-200",
    "hover:text-yellow-700",
    "active:bg-yellow-300",
    "dark:text-yellow-300",
    "dark:hover:text-yellow-200",
  ],
  dark: [
    "text-gray-500",
    "hover:bg-gray-200",
    "hover:text-gray-700",
    "active:bg-gray-300",
    "dark:text-gray-300",
    "dark:hover:text-gray-200",
  ],
};

const alertClasses = computed(() => typeClasses[props.type || "info"]);
const closeButtonClasses = computed(() => buttonClasses[props.type || "info"]);
</script>
