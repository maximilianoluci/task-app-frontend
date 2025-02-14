<template>
  <div>User {{ user?.name }}</div>
</template>

<script setup lang="ts">
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
    user.value = await userService.getUser(userId);
    console.log(user.value);
  } catch (error) {
    console.error(error);
  }
});
</script>
