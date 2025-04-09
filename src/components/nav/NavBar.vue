<template>
  <header class="flex w-full flex-wrap py-3 text-sm md:flex-nowrap md:justify-start">
    <nav class="mx-auto w-full max-w-[85rem] px-4 md:flex md:items-center md:justify-between">
      <RouterLink
        class="flex-none text-xl font-semibold text-black hover:opacity-80 active:opacity-60 dark:text-white"
        :to="{ name: 'home' }"
        aria-label="Brand"
      >
        Task App
      </RouterLink>
      <div class="mt-5 flex flex-row items-center gap-5 md:mt-0 md:ps-5">
        <UButton color="neutral" variant="link" @click="mode = mode === 'dark' ? 'light' : 'dark'">
          {{ mode === "dark" ? "Light" : "Dark" }} Mode
        </UButton>
        <UButton color="neutral" variant="link" @click="logOut()"> Log Out </UButton>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useColorMode } from "@vueuse/core";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const mode = useColorMode();

function logOut() {
  auth.logout();
  router.push({ name: "log-in" });
}
</script>
