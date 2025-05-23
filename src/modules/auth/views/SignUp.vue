<template>
  <h1 class="mb-2">Sign Up</h1>
  <UCard variant="subtle">
    <div class="space-y-3">
      <UForm :schema="createUserSchema" :state="form" class="space-y-3" @submit="create">
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
          Already have an account?
          <ULink
            to="log-in"
            class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
          >
            Log in
          </ULink>
          here!
        </span>
        <UButton type="submit" loading-auto>Sign Up</UButton>
      </UForm>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import UserService from "@/modules/user/services/UserService";
import type { CreateUser } from "@/modules/user/types/UserTypes";
import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { z } from "zod";

const router = useRouter();
const toast = useToast();

const userService = UserService.getInstance();

const errorMessage = ref<string | undefined>();

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

watch(errorMessage, (newValue) => {
  if (newValue) {
    setTimeout(() => (errorMessage.value = undefined), 3000);
  }
});

async function create() {
  Object.keys(errors).forEach((key) => (errors[key] = ""));

  const { success, error } = createUserSchema.safeParse(form);

  if (!success) {
    error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });
    return;
  }

  try {
    const newUser = { ...form };

    await userService.create(newUser as CreateUser);

    toast.add({
      title: "Success",
      description: "The user has successfully signed up.",
      color: "success",
      icon: "flowbite:check-circle-outline",
    });

    router.push({ name: "log-in" });
  } catch (error) {
    errorMessage.value = (error as Error).message || "An error occurred";
  }
}
</script>
