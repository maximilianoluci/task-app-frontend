<template>
  <div class="flex items-center gap-2">
    <UIcon name="line-md:loading-twotone-loop" class="size-10" />
    <span v-if="showText" class="text-xl">Loading...</span>
  </div>
</template>

<script setup lang="ts">
defineProps({
  showText: {
    type: Boolean,
    default: true,
  },
});
</script>
