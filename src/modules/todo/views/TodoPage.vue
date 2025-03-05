<template>
  <div v-if="!todo">
    <LoadingComponent />
  </div>
  <div v-else>
    <TitleComponent
      class="mb-2"
      icon="flowbite:edit-outline"
      show-back-button
      @back-button:clicked="handleBackButtonClick"
      @right-button:clicked="openEditModal"
    >
      <template #title>To Do Details</template>
      <template #button>Edit</template>
    </TitleComponent>
    <div class="space-y-2">
      <CardComponent padding="sm">
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
          <div>{{ todo.priority }}</div>
          <div class="font-semibold">Last Updated:</div>
          <div>{{ formatDate(todo.updatedAt) }}</div>
        </div>
        <div class="flex justify-end gap-2">
          <ButtonComponent icon="flowbite:trash-bin-outline" color="danger" @click="deleteTodo">
            Delete
          </ButtonComponent>
        </div>
      </CardComponent>
    </div>
    <ModalComponent v-if="isEditTodoModalVisible && editTodo">
      <template #header>
        <h1>Edit Todo</h1>
      </template>
      <template #body>
        <EditTodoComponent
          :edit-todo="editTodo"
          :loading="loading"
          @cancel="isEditTodoModalVisible = false"
          @save="save"
        />
      </template>
    </ModalComponent>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { z } from "zod";

import ButtonComponent from "@/components/button/ButtonComponent.vue";
import CardComponent from "@/components/card/CardComponent.vue";
import LoadingComponent from "@/components/loading/LoadingComponent.vue";
import TitleComponent from "@/components/title/TitleComponent.vue";
import EditTodoComponent from "@/modules/todo/components/EditTodoComponent.vue";

import TodoService from "@/modules/todo/services/TodoService";
import { Priority, type TodoId, type UpdateTodo } from "@/modules/todo/types/TodoTypes";
import router from "@/router";
import { formatDate } from "@/utils";

const ModalComponent = defineAsyncComponent(() => import("@/components/modal/ModalComponent.vue"));

const route = useRoute();
const todoService = TodoService.getInstance();

const loading = ref<boolean>(false);
const isEditTodoModalVisible = ref<boolean>(false);

const todoId = route.params.id as string;

const todo = ref<TodoId | undefined>();
const editTodo = ref<UpdateTodo | undefined>();

const updateTodoSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string(),
  dueDate: z.date(),
  completed: z.boolean(),
  priority: z.enum([...Object.values(Priority)] as [Priority, ...Priority[]]),
});

onMounted(async () => {
  try {
    todo.value = await todoService.findOne(todoId);
  } catch (error) {
    console.error(error);
  }
});

function openEditModal() {
  if (todo.value) {
    editTodo.value = {
      title: todo.value.title,
      description: todo.value.description,
      dueDate: todo.value.dueDate ? new Date(todo.value.dueDate) : new Date(),
      completed: todo.value.completed,
      priority: todo.value.priority,
    };
  }

  isEditTodoModalVisible.value = true;
}

function handleBackButtonClick() {
  if (!todo.value) return;

  router.push({ name: "list-page", params: { id: todo.value.listId } });
}

async function save(updatedTodo: UpdateTodo) {
  if (!todo.value) {
    return;
  }

  loading.value = true;

  try {
    updatedTodo.updatedAt = new Date();

    const finalTodo = await todoService.update(todoId, updateTodoSchema.parse(updatedTodo));
    todo.value = finalTodo;
    isEditTodoModalVisible.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

async function deleteTodo() {
  if (!todo.value) {
    return;
  }

  try {
    await todoService.remove(todoId);
    router.push({ name: "list-page", params: { id: todo.value.listId } });
  } catch (error) {
    console.error(error);
  }
}
</script>
