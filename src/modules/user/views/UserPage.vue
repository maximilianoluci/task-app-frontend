<template>
  <div v-if="!user">
    <LoadingComponent />
  </div>
  <div v-else>
    <h1>User Page</h1>
    <div>User: {{ user.name }}</div>
    <div>Email: {{ user.email }}</div>
    <ButtonComponent v-if="isCurrentUser" @click="changePassword">Change Password</ButtonComponent>
  </div>
</template>

<script setup lang="ts">
import ButtonComponent from "@/components/button/ButtonComponent.vue";
import LoadingComponent from "@/components/loading/LoadingComponent.vue";
import UserService from "@/modules/user/services/UserService";
import { type UserId } from "@/modules/user/types/UserTypes";
import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const authStore = useAuthStore();
const userService = UserService.getInstance();

const userId = route.params.id as string;
const user = ref<UserId | undefined>();

const isCurrentUser = computed(() => authStore.user?.id === userId);

onMounted(async () => {
  try {
    user.value = await userService.findOne(userId);
  } catch (error) {
    console.error(error);
  }
});

function changePassword() {
  router.push({ name: "change-password", params: { id: userId } });
}
</script>
