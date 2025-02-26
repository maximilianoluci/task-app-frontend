import type { CreateUser, User } from "@/modules/user/types/UserTypes";
import { get, patch, post } from "@/network";

export default class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async create(user: CreateUser) {
    try {
      return await post(`${import.meta.env.VITE_API_URL}/user`, user);
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      return await get(`${import.meta.env.VITE_API_URL}/user/${id}`);
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, user: User) {
    try {
      return await patch(`${import.meta.env.VITE_API_URL}/user/${id}`, user);
    } catch (error) {
      throw error;
    }
  }
}
