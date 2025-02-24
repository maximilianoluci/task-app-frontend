import type { CreateTodo } from "@/modules/todo/types/TodoTypes";
import { get, post } from "@/network";

export default class TodoService {
  private static instance: TodoService;

  private constructor() {}

  public static getInstance(): TodoService {
    if (!TodoService.instance) {
      TodoService.instance = new TodoService();
    }
    return TodoService.instance;
  }

  async create(todo: CreateTodo) {
    try {
      return await post(`${import.meta.env.VITE_API_URL}/todo`, todo);
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await get(`${import.meta.env.VITE_API_URL}/todo`);
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      return await get(`${import.meta.env.VITE_API_URL}/todo/${id}`);
    } catch (error) {
      throw error;
    }
  }
}
