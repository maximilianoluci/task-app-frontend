<template>
  <div class="flex items-center">
    <input
      :id
      v-bind="$attrs"
      type="checkbox"
      v-model="modelValue"
      class="h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
    />
    <label :for="id" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
      <slot>Default checkbox</slot>
    </label>
  </div>
</template>

<script setup lang="ts">
import { defineModel } from "vue";

const { id = `checkbox-${Math.random().toString(36).substring(2, 10)}` } = defineProps<{
  id?: string;
}>();

const modelValue = defineModel<boolean>();
</script>
