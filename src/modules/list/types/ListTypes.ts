export type CreateList = {
  title: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ListId = CreateList & {
  id: string;
};

export type UpdateList = Partial<CreateList>;
