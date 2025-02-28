<template>
  <div
    class="flex items-center"
    :class="{ 'rounded-md border border-gray-200 ps-4 dark:border-gray-700': bordered }"
  >
    <input
      :id
      v-bind="$attrs"
      type="checkbox"
      v-model="modelValue"
      class="h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
    />
    <label
      :for="id"
      class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      :class="{ 'w-full py-3': bordered }"
    >
      <slot>Default checkbox</slot>
    </label>
  </div>
</template>

<script setup lang="ts">
const { id = `checkbox-${Math.random().toString(36).substring(2, 10)}`, bordered } = defineProps<{
  id?: string;
  bordered?: boolean;
}>();

const modelValue = defineModel<boolean>();
</script>
