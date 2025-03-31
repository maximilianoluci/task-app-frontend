<template>
  <h1 class="mb-2">Log In</h1>
  <UCard variant="subtle">
    <div class="space-y-3">
      <UForm :schema="createUserSchema" :state="form" class="space-y-3" @submit="signIn">
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
        <span class="block text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?
          <ULink
            to="sign-up"
            class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
          >
            Sign up
          </ULink>
          here!
        </span>
        <UButton type="submit" loading-auto>Log In</UButton>
      </UForm>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import AuthService from "@/modules/auth/services/AuthService";
import type { SignInUser } from "@/modules/user/types/UserTypes";
import { useAuthStore } from "@/stores/auth";
import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { z } from "zod";

const router = useRouter();

const authStore = useAuthStore();

const authService = AuthService.getInstance();

const loading = ref<boolean>(false);
const errorMessage = ref<string | undefined>();

const fields = [
  { name: "email", label: "Email", type: "email" },
  { name: "password", label: "Password", type: "password" },
];

const form = reactive<Record<string, string>>({
  email: "",
  password: "",
});

const errors = reactive<Record<string, string>>({});

const createUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

watch(errorMessage, (newValue) => {
  if (newValue) {
    setTimeout(() => (errorMessage.value = undefined), 3000);
  }
});

async function signIn() {
  Object.keys(errors).forEach((key) => (errors[key] = ""));
  loading.value = true;

  const { success, error } = createUserSchema.safeParse(form);

  if (!success) {
    error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });
    loading.value = false;
    return;
  }

  try {
    const user = { ...form };

    const response = await authService.signIn(user as SignInUser);

    if (response.accessToken && response.refreshToken) {
      authStore.setTokens(response.accessToken, response.refreshToken);
      redirectToHome();
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    errorMessage.value = (error as Error).message;
  } finally {
    loading.value = false;
  }
}

function redirectToHome() {
  router.push({ name: "home" });
}
</script>
