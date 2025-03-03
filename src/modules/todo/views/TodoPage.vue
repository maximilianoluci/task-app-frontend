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
      </CardComponent>
    </div>
    <ModalComponent v-if="isEditTodoModalVisible && editTodo">
      <template #header>
        <h1>Edit Todo</h1>
      </template>
      <template #body>
        <div class="space-y-2">
          <InputComponent v-model="editTodo.title" label="Title" />
          <InputComponent v-model="editTodo.description" label="Description" />
          <div class="flex gap-2">
            <SelectComponent
              class="w-1/2"
              v-model="editTodo.priority"
              :options="priorityOptions"
              placeholder="Select a priority level"
              label="Priority"
            />
            <DateTimeComponent class="w-1/2" v-model="editTodo.dueDate" label="Due Date" />
          </div>
          <CheckboxComponent v-model="editTodo.completed" bordered>Completed</CheckboxComponent>
        </div>
        <div class="flex justify-end gap-2">
          <ButtonComponent color="secondary" @click="() => (isEditTodoModalVisible = false)"
            >Cancel</ButtonComponent
          >
          <ButtonComponent
            :disabled="loading"
            icon="flowbite:floppy-disk-alt-outline"
            @click="save"
          >
            {{ loading ? "Saving..." : "Save" }}
          </ButtonComponent>
        </div>
      </template>
    </ModalComponent>
  </div>
</template>

<script setup lang="ts">
import ButtonComponent from "@/components/button/ButtonComponent.vue";
import CardComponent from "@/components/card/CardComponent.vue";
import CheckboxComponent from "@/components/checkbox/CheckboxComponent.vue";
import DateTimeComponent from "@/components/date-time/DateTimeComponent.vue";
import InputComponent from "@/components/input/InputComponent.vue";
import LoadingComponent from "@/components/loading/LoadingComponent.vue";
import SelectComponent from "@/components/select/SelectComponent.vue";
import TitleComponent from "@/components/title/TitleComponent.vue";
import TodoService from "@/modules/todo/services/TodoService";
import { Priority, type TodoId, type UpdateTodo } from "@/modules/todo/types/TodoTypes";
import router from "@/router";
import { formatDate } from "@/utils";
import { defineAsyncComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { z } from "zod";

const ModalComponent = defineAsyncComponent(() => import("@/components/modal/ModalComponent.vue"));

const route = useRoute();

const todoService = TodoService.getInstance();

const loading = ref<boolean>(false);
const isEditTodoModalVisible = ref<boolean>(false);

const todoId = route.params.id as string;

const priorityOptions = Object.values(Priority).map((value) => ({
  name: value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
  value,
}));

const todo = ref<TodoId | undefined>();
const editTodo = ref<UpdateTodo | undefined>();

const updateTodoSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string(),
  dueDate: z.date(),
  completed: z.boolean(),
  priority: z.enum([...Object.values(Priority)] as [Priority, ...Priority[]]),
  createdAt: z.date(),
  updatedAt: z.date(),
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

async function save() {
  if (!editTodo.value || !todo.value) {
    return;
  }

  loading.value = true;

  try {
    editTodo.value.updatedAt = new Date();
    editTodo.value.createdAt = new Date(todo.value.createdAt);

    const updatedTodo = await todoService.update(todoId, updateTodoSchema.parse(editTodo.value));
    todo.value = updatedTodo;
    isEditTodoModalVisible.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}
</script>
