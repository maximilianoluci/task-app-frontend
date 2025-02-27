<template>
  <div class="flex justify-between">
    <div class="flex items-center gap-2">
      <Icon
        v-if="showBackButton"
        icon="flowbite:arrow-left-outline"
        class="size-8 cursor-pointer"
        @click="backButtonClicked"
      />
      <h1 v-if="!isSubtitle"><slot name="title"></slot></h1>
      <h2 v-if="isSubtitle"><slot name="title"></slot></h2>
    </div>
    <ButtonComponent :icon size="xs" @click="rightButtonClicked">
      <slot name="button"></slot>
    </ButtonComponent>
  </div>
</template>

<script setup lang="ts">
import ButtonComponent from "@/components/button/ButtonComponent.vue";
import { Icon } from "@iconify/vue/dist/iconify.js";

const { icon, showBackButton, isSubtitle } = defineProps<{
  icon: string;
  showBackButton?: boolean;
  isSubtitle?: boolean;
}>();

const emit = defineEmits(["right-button:clicked", "back-button:clicked"]);

function rightButtonClicked() {
  emit("right-button:clicked");
}

function backButtonClicked() {
  emit("back-button:clicked");
}
</script>
