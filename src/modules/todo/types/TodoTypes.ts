export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export type CreateTodo = {
  title: string;
  description?: string;
  dueDate?: Date;
  completed: boolean;
  priority?: Priority;
  createdAt: Date;
  updatedAt: Date;
  listId: string;
};

export type TodoId = CreateTodo & {
  id: string;
};

export type UpdateTodo = Partial<CreateTodo>;
