<template>
  <AlertComponent
    v-if="errorMessage"
    class="absolute inset-x-0 top-4 left-1/2 z-50 w-fit -translate-x-1/2 transform"
    type="danger"
    :message="errorMessage"
    closable
    @click="clearMessage"
  />
  <div class="mx-auto mt-4 w-5xl">
    <h1 class="mb-2">Log In</h1>
    <CardComponent padding="sm">
      <div class="space-y-3">
        <InputComponent
          v-for="field in fields"
          :key="field.name"
          v-bind="field"
          v-model="form[field.name]"
          :error="errors[field.name]"
        />
        <span class="block text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?
          <RouterLink
            to="sign-up"
            class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
          >
            Sign up
          </RouterLink>
          here!
        </span>
        <ButtonComponent
          :icon="loading ? 'line-md:loading-twotone-loop' : undefined"
          :disabled="loading"
          @click="signIn"
        >
          {{ loading ? "Logging In..." : "Log In" }}
        </ButtonComponent>
      </div>
    </CardComponent>
  </div>
</template>

<script setup lang="ts">
import AlertComponent from "@/components/alert/AlertComponent.vue";
import ButtonComponent from "@/components/button/ButtonComponent.vue";
import CardComponent from "@/components/card/CardComponent.vue";
import InputComponent from "@/components/input/InputComponent.vue";
import UserService from "@/modules/user/services/UserService";
import type { SignInUser } from "@/modules/user/types/UserTypes";
import router from "@/router";
import { reactive, ref, watch } from "vue";
import { z } from "zod";

const userService = UserService.getInstance();

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

function clearMessage() {
  errorMessage.value = undefined;
}

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

    await userService.signIn(user as SignInUser);
    redirectToHome();
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
