<template>
  <div class="flex items-center gap-2">
    <Icon icon="line-md:loading-twotone-loop" class="size-10" />
    <span v-if="showText" class="text-xl">Loading...</span>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue/dist/iconify.js";

defineProps({
  showText: {
    type: Boolean,
    default: true,
  },
});
</script>
