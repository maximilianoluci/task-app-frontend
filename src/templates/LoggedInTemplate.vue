<template>
  <NavBar />
  <div class="mx-auto max-w-7xl px-2 py-3">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/nav/NavBar.vue";
import { RouterView } from "vue-router";
</script>
