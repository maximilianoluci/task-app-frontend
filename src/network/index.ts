import { useAuthStore } from "@/stores/auth";
import axios from "axios";

const get = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const post = async (url: string, data: unknown) => {
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const patch = async (url: string, data: unknown) => {
  try {
    const response = await axios.patch(url, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const put = async (url: string, data: unknown) => {
  try {
    const authStore = useAuthStore();
    const headers = {
      Authorization: `Bearer ${authStore.accessToken}`,
    };

    const response = await axios.put(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const remove = async (url: string) => {
  try {
    const response = await axios.delete(url);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { get, patch, post, put, remove };
