<template>
  <div v-if="!todo">
    <LoadingComponent />
  </div>
  <div v-else>
    <div class="mb-2 flex justify-between">
      <div class="flex items-center gap-2">
        <UIcon
          name="flowbite:arrow-left-outline"
          class="size-8 cursor-pointer"
          @click="handleBackButtonClick"
        />
        <h1>To Do Details</h1>
      </div>
      <UModal
        title="Edit To-do Item"
        description="Edit the details of the to-do item"
        v-model:open="isEditTodoModalOpen"
      >
        <UButton icon="flowbite:edit-outline">Edit</UButton>

        <template #body>
          <TodoForm :schema :state edit @submit="save" />
        </template>
      </UModal>
    </div>
    <UCard variant="subtle">
      <div class="grid w-fit grid-cols-2">
        <div class="font-semibold">Title:</div>
        <div>{{ todo.title }}</div>
        <div class="font-semibold">Description:</div>
        <div>{{ todo.description || "-" }}</div>
        <div class="font-semibold">Due Date:</div>
        <div>{{ todo.dueDate ? formatDate(todo.dueDate) : "-" }}</div>
        <div class="font-semibold">Completed:</div>
        <div>{{ todo.completed ? "Yes" : "No" }}</div>
        <div class="font-semibold">Priority:</div>
        <div>{{ toSentenceCase(todo.priority || "") }}</div>
        <div class="font-semibold">Last Updated:</div>
        <div>{{ formatDate(todo.updatedAt) }}</div>
      </div>
      <div class="flex justify-end gap-2">
        <UButton icon="flowbite:trash-bin-outline" color="error" @click="deleteTodo">
          Delete
        </UButton>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import LoadingComponent from "@/components/loading/LoadingComponent.vue";
import TodoForm from "@/modules/todo/components/TodoForm.vue";
import TodoService from "@/modules/todo/services/TodoService";
import { Priority, type TodoId, type UpdateTodo } from "@/modules/todo/types/TodoTypes";
import { formatDate, toSentenceCase } from "@/utils";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { z } from "zod";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const todoService = TodoService.getInstance();

const isEditTodoModalOpen = ref(false);

const todoId = route.params.id as string;

const todo = ref<TodoId>();

const state = ref<UpdateTodo>({});

const schema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  completed: z.boolean(),
  priority: z.enum([...Object.values(Priority)] as [Priority, ...Priority[]]),
});

onMounted(async () => {
  try {
    todo.value = await todoService.findOne(todoId);

    if (!todo.value) return;

    state.value = {
      title: todo.value.title,
      description: todo.value.description,
      dueDate: todo.value.dueDate ? new Date(todo.value.dueDate) : undefined,
      completed: todo.value.completed,
      priority: todo.value.priority,
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error(error);
  }
});

function handleBackButtonClick() {
  if (todo.value) router.push({ name: "list-page", params: { id: todo.value.listId } });
}

async function save(updatedTodo: UpdateTodo) {
  if (!updatedTodo || !todo.value) return;

  try {
    todo.value = await todoService.update(todoId, schema.parse(updatedTodo));

    toast.add({
      title: "Success",
      description: "The to-do item has been updated.",
      color: "success",
      icon: "flowbite:check-circle-outline",
    });

    isEditTodoModalOpen.value = false;
  } catch (error) {
    console.error(error);
  }
}

async function deleteTodo() {
  if (!todo.value) return;

  try {
    await todoService.remove(todoId);
    router.push({ name: "list-page", params: { id: todo.value.listId } });
  } catch (error) {
    console.error(error);
  }
}
</script>
