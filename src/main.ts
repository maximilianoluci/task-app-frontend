import "./assets/main.css";

import { createPinia } from "pinia";
import { createApp } from "vue";

import ui from "@nuxt/ui/vue-plugin";
import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "./stores/auth";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(ui);

app.mount("#app");

const authStore = useAuthStore();
authStore.checkAuth();
