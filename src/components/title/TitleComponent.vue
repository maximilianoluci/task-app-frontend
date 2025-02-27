<template>
  <div class="flex justify-between">
    <div class="flex items-center gap-2">
      <Icon
        v-if="showBackButton"
        icon="flowbite:arrow-left-outline"
        class="size-8 cursor-pointer"
        @click="backButtonClicked"
      />
      <h1><slot name="title"></slot></h1>
    </div>
    <ButtonComponent :icon color="transparent" @click="rightButtonClicked">
      <slot name="button"></slot>
    </ButtonComponent>
  </div>
</template>

<script setup lang="ts">
import ButtonComponent from "@/components/button/ButtonComponent.vue";
import { Icon } from "@iconify/vue/dist/iconify.js";

const { icon, showBackButton } = defineProps<{
  icon: string;
  showBackButton?: boolean;
}>();

const emit = defineEmits(["right-button:clicked", "back-button:clicked"]);

function rightButtonClicked() {
  emit("right-button:clicked");
}

function backButtonClicked() {
  emit("back-button:clicked");
}
</script>
