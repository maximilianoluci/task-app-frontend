import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    accessToken: null as string | null,
  }),
  actions: {
    setAccessToken(token: string) {
      this.accessToken = token;
      this.isAuthenticated = true;
      localStorage.setItem("access_token", token); // Save the token in localStorage
    },
    logout() {
      this.accessToken = null;
      this.isAuthenticated = false;
      localStorage.removeItem("access_token"); // Remove the token from localStorage
    },
    checkAuth() {
      const token = localStorage.getItem("access_token");
      if (token) {
        this.accessToken = token;
        this.isAuthenticated = true;
      }
    },
  },
});
