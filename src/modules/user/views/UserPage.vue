<template>
  <div v-if="!user">
    <LoadingComponent />
  </div>
  <div v-else>
    <h1>User Page</h1>
    <div>User {{ user?.name }}</div>
  </div>
</template>

<script setup lang="ts">
import LoadingComponent from "@/components/loading/LoadingComponent.vue";
import UserService from "@/modules/user/services/UserService";
import { type UserId } from "@/modules/user/types/UserTypes";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const userService = UserService.getInstance();

const userId = route.params.id as string;

const user = ref<UserId | undefined>();

onMounted(async () => {
  try {
    user.value = await userService.findOne(userId);
  } catch (error) {
    console.error(error);
  }
});
</script>
