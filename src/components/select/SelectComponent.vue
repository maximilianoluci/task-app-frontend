<template>
  <div class="mx-auto max-w-sm">
    <label :for="id" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">{{
      label
    }}</label>
    <select
      :id
      v-model="modelValue"
      class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      :aria-label="label"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
export type Option = {
  name: string;
  value: string;
};

const {
  id = `select-${Math.random().toString(36).substring(2, 10)}`,
  label,
  placeholder,
  options,
} = defineProps<{
  label?: string;
  id?: string;
  placeholder?: string;
  options: Option[];
}>();

const modelValue = defineModel<string>({ default: "" });
</script>
