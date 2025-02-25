import { jwtDecode } from "jwt-decode";
import { defineStore } from "pinia";

interface User {
  id: string;
  name: string;
  email: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    accessToken: null as string | null,
    refreshToken: null as string | null,
    user: null as User | null,
  }),
  actions: {
    setTokens(accessToken: string, refreshToken: string) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.isAuthenticated = true;
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      try {
        const decoded = jwtDecode<{ id: string; name: string; email: string }>(accessToken);
        this.user = { id: decoded.id, name: decoded.name, email: decoded.email };
      } catch {
        this.logout();
      }
    },
    logout() {
      this.accessToken = null;
      this.refreshToken = null;
      this.isAuthenticated = false;
      this.user = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    },
    checkAuth() {
      const token = localStorage.getItem("access_token");
      if (token) {
        this.accessToken = token;
        this.isAuthenticated = true;
        try {
          const decoded = jwtDecode<{ id: string; name: string; email: string }>(token);
          this.user = { id: decoded.id, name: decoded.name, email: decoded.email };
        } catch {
          this.logout();
        }
      }
    },
  },
});
