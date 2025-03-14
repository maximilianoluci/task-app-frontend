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
        <button
          class="cursor-pointer font-medium text-gray-600 hover:text-gray-400 active:text-gray-500 dark:text-neutral-400 dark:hover:text-neutral-500 dark:active:text-neutral-600"
          @click="toggleDark()"
        >
          {{ isDark ? "Light" : "Dark" }} Mode
        </button>
        <button
          class="cursor-pointer font-medium text-gray-600 hover:text-gray-400 active:text-gray-500 dark:text-neutral-400 dark:hover:text-neutral-500 dark:active:text-neutral-600"
          @click="logOut()"
        >
          Log Out
        </button>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useDark, useToggle } from "@vueuse/core";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const isDark = useDark();
const toggleDark = useToggle(isDark);

function logOut() {
  auth.logout();
  router.push({ name: "log-in" });
}
</script>
