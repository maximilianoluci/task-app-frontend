<template>
  <div
    class="block rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
    :class="computedClasses"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  padding?: "sm" | "md";
  hover?: boolean;
}>();

const computedClasses = computed(() => {
  const classes: string[] = [];

  switch (props.padding) {
    case "sm":
      classes.push("p-4");
      break;

    case "md":
    default:
      classes.push("p-6");
      break;
  }

  if (props.hover) {
    classes.push("hover:bg-gray-100", "dark:hover:bg-gray-700");
  }

  return classes.join(" ");
});
</script>
