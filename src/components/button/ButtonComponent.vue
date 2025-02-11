<template>
  <button
    type="button"
    class="cursor-pointer rounded-lg text-center font-medium text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
    :class="[computedColorClass, computedSizeClass]"
    v-bind="$attrs"
  >
    <div class="flex items-center justify-center gap-2">
      <Icon v-if="icon" :icon="icon" :class="[computedIconSize, iconClasses]" />
      <slot></slot>
    </div>
  </button>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed } from "vue";

const props = defineProps<{
  color?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "transparent";
  icon?: string;
  iconClasses?: string;
  size?: "xs" | "sm" | "base" | "lg" | "xl";
}>();

const colorClasses = {
  primary: [
    "bg-blue-500",
    "enabled:hover:bg-blue-800",
    "enabled:active:bg-blue-900",
    "dark:bg-blue-600",
    "enabled:dark:hover:bg-blue-700",
    "enabled:dark:active:bg-blue-800",
  ],
  secondary: [
    "bg-gray-500",
    "enabled:hover:bg-gray-800",
    "enabled:active:bg-gray-300",
    "dark:bg-gray-600",
    "enabled:dark:hover:bg-gray-700",
    "enabled:dark:active:bg-gray-800",
  ],
  success: [
    "bg-green-500",
    "enabled:hover:bg-green-800",
    "enabled:active:bg-green-300",
    "dark:bg-green-600",
    "enabled:dark:hover:bg-green-700",
    "enabled:dark:active:bg-green-800",
  ],
  danger: [
    "bg-red-500",
    "enabled:hover:bg-red-800",
    "enabled:active:bg-red-300",
    "dark:bg-red-600",
    "enabled:dark:hover:bg-red-700",
    "enabled:dark:active:bg-red-800",
  ],
  warning: [
    "bg-yellow-500",
    "enabled:hover:bg-yellow-800",
    "enabled:active:bg-yellow-300",
    "dark:bg-yellow-600",
    "enabled:dark:hover:bg-yellow-700",
    "enabled:dark:active:bg-yellow-800",
  ],
  info: [
    "bg-cyan-500",
    "enabled:hover:bg-cyan-800",
    "enabled:active:bg-cyan-300",
    "dark:bg-cyan-600",
    "enabled:dark:hover:bg-cyan-700",
    "enabled:dark:active:bg-cyan-800",
  ],
  transparent: ["text-black", "border", "border-none", "active:outline-none", "dark:text-white"],
};

const sizeClasses = {
  xs: ["px-3", "py-2", "text-xs"],
  sm: ["px-3", "py-2", "text-sm"],
  base: ["px-5", "py-2.5", "text-sm"],
  lg: ["px-5", "py-3", "text-base"],
  xl: ["px-6", "py-3.5", "text-base"],
};

const iconSizes = {
  xs: ["size-3"],
  sm: ["size-3"],
  base: ["size-3.5"],
  lg: ["size-4"],
  xl: ["size-4"],
};

const computedColorClass = computed(() => colorClasses[props.color ?? "primary"]);
const computedSizeClass = computed(() => sizeClasses[props.size ?? "base"]);
const computedIconSize = computed(() => iconSizes[props.size ?? "base"]);
</script>
