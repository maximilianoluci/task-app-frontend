<template>
  <div class="flex justify-between">
    <div class="flex cursor-pointer items-center gap-2" @click="backButtonClicked">
      <Icon icon="flowbite:arrow-left-outline" class="size-8" />
      <h1><slot></slot></h1>
    </div>
    <ButtonComponent icon="flowbite:edit-outline" color="transparent" @click="editButtonClicked">
      Edit
    </ButtonComponent>
  </div>
</template>

<script setup lang="ts">
import ButtonComponent from "@/components/button/ButtonComponent.vue";
import { Icon } from "@iconify/vue/dist/iconify.js";

const emit = defineEmits(["edit-button:clicked", "back-button:clicked"]);

function editButtonClicked() {
  emit("edit-button:clicked");
}

function backButtonClicked() {
  emit("back-button:clicked");
}
</script>
