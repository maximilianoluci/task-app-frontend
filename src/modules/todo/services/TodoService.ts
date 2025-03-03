import type { CreateTodo, UpdateTodo } from "@/modules/todo/types/TodoTypes";
import { get, patch, post, remove } from "@/network";

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

  async findAll(listId: string) {
    try {
      return await get(`${import.meta.env.VITE_API_URL}/todo/${listId}/all`);
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

  async update(id: string, todo: UpdateTodo) {
    try {
      return await patch(`${import.meta.env.VITE_API_URL}/todo/${id}`, todo);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await remove(`${import.meta.env.VITE_API_URL}/todo/${id}`);
    } catch (error) {
      throw error;
    }
  }
}
