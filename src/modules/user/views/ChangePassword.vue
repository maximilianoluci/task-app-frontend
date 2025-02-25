<template>
  <AlertComponent
    v-if="errorMessage"
    class="absolute inset-x-0 top-4 left-1/2 z-50 w-fit -translate-x-1/2 transform"
    type="danger"
    :message="errorMessage"
    closable
    @click="clearMessage"
  />
  <h1 class="mb-2">Change Password</h1>
  <CardComponent padding="sm">
    <div class="space-y-3">
      <InputComponent
        v-for="field in fields"
        :key="field.name"
        v-bind="field"
        v-model="form[field.name]"
        :error="errors[field.name]"
      />
      <ButtonComponent
        :icon="loading ? 'line-md:loading-twotone-loop' : undefined"
        :disabled="loading"
        @click="changePassword"
      >
        {{ loading ? "Changing Password..." : "Change Password" }}
      </ButtonComponent>
    </div>
  </CardComponent>
</template>

<script setup lang="ts">
import AlertComponent from "@/components/alert/AlertComponent.vue";
import ButtonComponent from "@/components/button/ButtonComponent.vue";
import CardComponent from "@/components/card/CardComponent.vue";
import InputComponent from "@/components/input/InputComponent.vue";
import AuthService from "@/modules/auth/services/AuthService";
import router from "@/router";
import { reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { z } from "zod";

const route = useRoute();

const authService = AuthService.getInstance();

const loading = ref<boolean>(false);
const errorMessage = ref<string | undefined>();

const userId = route.params.id as string;

const fields = [
  { name: "currentPassword", label: "Current Password", type: "password" },
  { name: "newPassword", label: "New Password", type: "password" },
  { name: "newPasswordConfirm", label: "Confirm New Password", type: "password" },
];

const form = reactive<Record<string, string>>({
  currentPassword: "",
  newPassword: "",
  newPasswordConfirm: "",
});

const errors = reactive<Record<string, string>>({});

const createUserSchema = z.object({
  currentPassword: z.string().min(5, "Current password is required"),
  newPassword: z.string().min(5, "New password is required"),
  newPasswordConfirm: z.string().min(5, "Confirm new password is required"),
});

watch(errorMessage, (newValue) => {
  if (newValue) {
    setTimeout(() => (errorMessage.value = undefined), 3000);
  }
});

function clearMessage() {
  errorMessage.value = undefined;
}

async function changePassword() {
  Object.keys(errors).forEach((key) => (errors[key] = ""));

  const { currentPassword, newPassword, newPasswordConfirm } = form;

  try {
    createUserSchema.parse({ currentPassword, newPassword, newPasswordConfirm });

    if (newPassword !== newPasswordConfirm) {
      errors.newPasswordConfirm = "Passwords do not match";
      return;
    }

    loading.value = true;

    await authService.changePassword({
      id: userId,
      currentPassword,
      newPassword,
      newPasswordConfirm,
    });

    loading.value = false;

    errorMessage.value = undefined;

    router.push({ name: "user-page", params: { id: userId } });
  } catch (error) {
    errorMessage.value = (error as Error).message;
  } finally {
    loading.value = false;
  }
}
</script>
