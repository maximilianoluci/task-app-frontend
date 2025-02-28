<template>
  <div>
    <label :for="id" class="mb-0.5 block text-sm font-medium text-gray-900 dark:text-white">
      {{ label }}
    </label>
    <input
      :id="id"
      type="datetime-local"
      :value="formattedDateTime"
      v-bind="$attrs"
      class="block w-full rounded-lg p-2.5 text-sm focus:outline-2 focus:outline-blue-500 dark:bg-gray-700"
      @input="updateDateTime($event)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const { id = `datetime-${Math.random().toString(36).substring(2, 9)}`, label } = defineProps<{
  id?: string;
  label: string;
}>();

const dateTime = defineModel<Date>();

const formattedDateTime = computed(() =>
  dateTime.value
    ? new Date(dateTime.value.getTime() - dateTime.value.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)
    : "",
);

const updateDateTime = (event: Event) => {
  const input = (event.target as HTMLInputElement).value;
  dateTime.value = input ? new Date(input) : undefined;
};
</script>
