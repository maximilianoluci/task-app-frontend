<template>
  <AlertComponent
    v-if="errorMessage"
    class="absolute inset-x-0 top-4 left-1/2 z-50 w-fit -translate-x-1/2 transform"
    type="danger"
    :message="errorMessage"
    closable
    @click="clearMessage"
  />
  <div class="relative z-0 mx-auto">
    <h1 class="mb-2">Sign Up</h1>
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
          @click="create"
        >
          {{ loading ? "Signing Up..." : "Sign Up" }}
        </ButtonComponent>
      </div>
    </CardComponent>
  </div>
  <ModalComponent
    v-if="isModalVisible"
    show-close-button
    @update:visible="() => (isModalVisible = false)"
  >
    <template #body>
      <div class="flex flex-col items-center gap-2">
        <Icon
          icon="flowbite:check-circle-outline"
          class="size-14 text-green-800 dark:text-green-400"
        />
        <p class="text-bold text-center text-xl">Sign up successful!</p>
        <ButtonComponent @click="goToLogin">Log In</ButtonComponent>
      </div>
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
import AlertComponent from "@/components/alert/AlertComponent.vue";
import ButtonComponent from "@/components/button/ButtonComponent.vue";
import CardComponent from "@/components/card/CardComponent.vue";
import InputComponent from "@/components/input/InputComponent.vue";
import UserService from "@/modules/user/services/UserService";
import type { CreateUser } from "@/modules/user/types/UserTypes";
import router from "@/router";
import { Icon } from "@iconify/vue";
import { defineAsyncComponent, reactive, ref, watch } from "vue";
import { z } from "zod";

const userService = UserService.getInstance();

const loading = ref<boolean>(false);
const isModalVisible = ref<boolean>(false);
const errorMessage = ref<string | undefined>();

const ModalComponent = defineAsyncComponent(() => import("@/components/modal/ModalComponent.vue"));

const fields = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "password", label: "Password", type: "password" },
  { name: "passwordConfirm", label: "Confirm Password", type: "password" },
];

const form = reactive<Record<string, string>>({
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
});

const errors = reactive<Record<string, string>>({});

const createUserSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(5, "Password must be at least 5 characters"),
    passwordConfirm: z.string().min(5, "Password must be at least 5 characters"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["passwordConfirm"],
      });
    }
  });

function clearMessage() {
  errorMessage.value = undefined;
}

watch(errorMessage, (newValue) => {
  if (newValue) {
    setTimeout(() => (errorMessage.value = undefined), 3000);
  }
});

async function create() {
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
    const newUser = { ...form };

    await userService.create(newUser as CreateUser);
    isModalVisible.value = true;
  } catch (error) {
    errorMessage.value = (error as Error).message || "An error occurred";
  } finally {
    loading.value = false;
  }
}

function goToLogin() {
  router.push({ name: "log-in" });
}
</script>
