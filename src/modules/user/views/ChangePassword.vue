<template>
  <h1 class="mb-2">Change Password</h1>
  <UCard variant="subtle">
    <div class="space-y-3">
      <UForm
        :schema="changePasswordSchema"
        :state="form"
        class="space-y-3"
        @submit="changePassword"
      >
        <UFormField
          v-for="field in fields"
          :key="field.name"
          :label="field.label"
          :type="field.type"
          v-model="form[field.name]"
        >
          <UInput
            v-model="form[field.name]"
            :type="field.type"
            class="w-full"
            :error="errors[field.name]"
          />
        </UFormField>
        <UButton type="submit" loading-auto>Change Password</UButton>
      </UForm>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import AuthService from "@/modules/auth/services/AuthService";
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { z } from "zod";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const authService = AuthService.getInstance();

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

const changePasswordSchema = z.object({
  currentPassword: z.string().min(5, "Current password is required"),
  newPassword: z.string().min(5, "New password is required"),
  newPasswordConfirm: z.string().min(5, "Confirm new password is required"),
});

async function changePassword() {
  Object.keys(errors).forEach((key) => (errors[key] = ""));

  const { currentPassword, newPassword, newPasswordConfirm } = form;

  try {
    changePasswordSchema.parse({ currentPassword, newPassword, newPasswordConfirm });

    if (newPassword !== newPasswordConfirm) {
      errors.newPasswordConfirm = "Passwords do not match";
      return;
    }

    await authService.changePassword({
      id: userId,
      currentPassword,
      newPassword,
      newPasswordConfirm,
    });

    toast.add({
      title: "Success",
      description: "The password has been changed successfully.",
      color: "success",
      icon: "flowbite:check-circle-outline",
    });

    router.push({ name: "user-page", params: { id: userId } });
  } catch (error) {
    errorMessage.value = (error as Error).message;
  }
}
</script>
