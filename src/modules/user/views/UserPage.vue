<template>
  <div>User {{ userId }}</div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();

const userId = route.params.id;
</script>
