<template>
  <div>
    <label :for="computedId" class="mb-0.5 block text-sm font-medium text-gray-900 dark:text-white"
      >{{ label }}<span v-if="required">*</span>
    </label>
    <input
      :id="computedId"
      v-bind="$attrs"
      v-model="modelValue"
      class="block w-full rounded-lg border p-2.5 text-sm dark:bg-gray-700"
      :class="computedErrorClass"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  id?: string;
  label: string;
  error?: string;
  required?: boolean;
}>();

const errorClasses = [
  "border-red-500",
  "bg-red-50",
  "text-red-900",
  "placeholder-red-700",
  "focus:outline-2",
  "focus:outline-red-500",
  "dark:border-red-500",
  "dark:text-red-500",
  "dark:placeholder-red-500",
];

const normalClasses = [
  "border-gray-300",
  "bg-gray-50",
  "text-gray-900",
  "focus:outline-2",
  "focus:outline-blue-500",
  "dark:border-gray-600",
  "dark:text-white",
  "dark:placeholder-gray-400",
];

const computedId = computed(
  () => props.id ?? `input-${Math.random().toString(36).substring(2, 9)}`,
);

const computedErrorClass = computed(() => {
  return props.error ? errorClasses.join(" ") : normalClasses.join(" ");
});

const modelValue = defineModel<string>();
</script>
