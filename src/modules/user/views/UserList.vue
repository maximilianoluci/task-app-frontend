<template>
  <div v-if="!users">
    <LoadingComponent />
  </div>
  <div v-else>
    <h1>User List</h1>
    <CardComponent
      v-for="user in users"
      :key="user.id"
      class="mb-2"
      hover
      padding="sm"
      @click="() => goToUser(user.id)"
    >
      {{ user.name }} - {{ user.email }}
    </CardComponent>
  </div>
</template>

<script setup lang="ts">
import CardComponent from "@/components/card/CardComponent.vue";
import LoadingComponent from "@/components/loading/LoadingComponent.vue";
import UserService from "@/modules/user/services/UserService";
import type { UserId } from "@/modules/user/types/UserTypes";
import router from "@/router";
import { onMounted, ref } from "vue";

const userService = UserService.getInstance();

const users = ref<UserId[] | undefined>();

onMounted(async () => {
  try {
    users.value = await userService.findAll();
  } catch (error) {
    console.error(error);
  }
});

function goToUser(userId: string) {
  router.push({ name: "user-page", params: { id: userId } });
}
</script>
