<template>
  <div v-if="!list">
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
      <template #title>List Details</template>
      <template #button>Edit</template>
    </TitleComponent>
    <div class="space-y-2">
      <CardComponent padding="sm">
        <div class="grid w-fit grid-cols-2">
          <div class="font-semibold">Title:</div>
          <div>{{ list.title }}</div>
          <div class="font-semibold">Last Updated:</div>
          <div>{{ formatDate(list.updatedAt) }}</div>
        </div>
        <div class="flex justify-end gap-2">
          <ButtonComponent
            name="flowbite:trash-bin-outline"
            color="danger"
            @click="openDeleteModal"
          >
            Delete
          </ButtonComponent>
        </div>
      </CardComponent>
      <TitleComponent
        class="mb-2"
        icon="flowbite:plus-outline"
        is-subtitle
        @right-button:clicked="openNewModal"
      >
        <template #title>To Do List</template>
        <template #button>New</template>
      </TitleComponent>
      <div class="space-y-2">
        <CardComponent
          v-for="todo in todos"
          :key="todo.id"
          @click="() => router.push({ name: 'todo-page', params: { id: todo.id } })"
          padding="sm"
          hover
        >
          <h3>{{ todo.title }}</h3>
          <h6 v-if="todo.description">{{ todo.description }}</h6>
        </CardComponent>
      </div>
    </div>
  </div>
  <ModalComponent v-if="isEditListModalVisible && editList">
    <template #header>
      <h1>Edit List</h1>
    </template>
    <template #body>
      <div class="space-y-2">
        <InputComponent v-model="editList.title" label="Title" />
      </div>
      <div class="flex justify-end gap-2">
        <ButtonComponent color="secondary" @click="() => (isEditListModalVisible = false)">
          Cancel
        </ButtonComponent>
        <ButtonComponent
          :disabled="loading"
          name="flowbite:floppy-disk-alt-outline"
          @click="saveList"
        >
          {{ loading ? "Saving..." : "Save" }}
        </ButtonComponent>
      </div>
    </template>
  </ModalComponent>
  <ModalComponent v-if="isNewTodoModalVisible">
    <template #header>
      <h1>New Todo</h1>
    </template>
    <template #body>
      <div class="space-y-2">
        <InputComponent v-model="newTodo.title" label="Title" />
        <InputComponent v-model="newTodo.description" label="Description" />
        <div class="flex gap-2">
          <SelectComponent
            class="w-1/2"
            v-model="newTodo.priority"
            :options="priorityOptions"
            placeholder="Select a priority level"
            label="Priority"
          />
          <DateTimeComponent class="w-1/2" v-model="newTodo.dueDate" label="Due Date" />
        </div>
        <CheckboxComponent v-model="newTodo.completed" bordered>Completed</CheckboxComponent>
      </div>
      <div class="flex justify-end gap-2">
        <ButtonComponent color="secondary" @click="closeNewTodoModal">Cancel</ButtonComponent>
        <ButtonComponent
          :disabled="loading"
          name="flowbite:floppy-disk-alt-outline"
          @click="saveNewTodo"
        >
          {{ loading ? "Saving..." : "Save" }}
        </ButtonComponent>
      </div>
    </template>
  </ModalComponent>
  <ModalComponent v-if="isDeleteModalVisible">
    <template #body>
      <div class="space-y-2 text-center">
        <div class="flex items-center justify-center gap-2">
          <UIcon name="fluent:warning-48-filled" class="size-14 text-yellow-300" />
          <span class="text-5xl font-bold">WARNING!</span>
          <UIcon name="fluent:warning-48-filled" class="size-14 text-yellow-300" />
        </div>
        <div class="space-y-1">
          <p>
            If you delete this list,
            <span class="font-bold">all associated to-do items will also be deleted.</span>
          </p>
          <p class="italic">Are you sure you want to proceed?</p>
        </div>
      </div>
      <div class="flex justify-end gap-2">
        <ButtonComponent color="secondary" @click="closeDeleteModal">Cancel</ButtonComponent>
        <ButtonComponent
          name="flowbite:trash-bin-outline"
          :disabled="loading"
          color="danger"
          @click="deleteList"
        >
          {{ loading ? "Deleting..." : "Delete" }}
        </ButtonComponent>
      </div>
    </template>
  </ModalComponent>
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
import ListService from "@/modules/list/services/ListService";
import type { ListId, UpdateList } from "@/modules/list/types/ListTypes";
import TodoService from "@/modules/todo/services/TodoService";
import { Priority, type CreateTodo, type TodoId } from "@/modules/todo/types/TodoTypes";
import { formatDate } from "@/utils";
import { defineAsyncComponent, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { z } from "zod";

const ModalComponent = defineAsyncComponent(() => import("@/components/modal/ModalComponent.vue"));

const route = useRoute();
const router = useRouter();

const listService = ListService.getInstance();
const todoService = TodoService.getInstance();

const loading = ref<boolean>(false);
const isEditListModalVisible = ref<boolean>(false);
const isNewTodoModalVisible = ref<boolean>(false);
const isDeleteModalVisible = ref<boolean>(false);

const listId = route.params.id as string;

const priorityOptions = Object.values(Priority).map((value) => ({
  name: value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
  value,
}));

const list = ref<ListId | undefined>();
const editList = ref<UpdateList | undefined>();

const todos = ref<TodoId[] | undefined>();
const newTodo = ref<CreateTodo>({
  title: "",
  description: "",
  completed: false,
  priority: Priority.LOW,
  createdAt: new Date(),
  updatedAt: new Date(),
  listId,
});

const updateListSchema = z.object({
  title: z.string().nonempty("Title is required"),
});

const createTodoSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string(),
  dueDate: z.date().optional(),
  completed: z.boolean(),
  priority: z.enum([...Object.values(Priority)] as [Priority, ...Priority[]]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

onMounted(async () => {
  try {
    list.value = await listService.findOne(listId);
    todos.value = await todoService.findAll(listId);
  } catch (error) {
    console.error(error);
  }
});

function openEditModal() {
  editList.value = list.value;
  isEditListModalVisible.value = true;
}

function openNewModal() {
  isNewTodoModalVisible.value = true;
}

function closeNewTodoModal() {
  isNewTodoModalVisible.value = false;
}

function handleBackButtonClick() {
  if (!list.value) return;

  router.push({ name: "list-list", params: { userId: list.value.userId } });
}

async function saveList() {
  if (!editList.value) {
    return;
  }

  loading.value = true;

  try {
    editList.value.updatedAt = new Date();
    const updatedList = await listService.update(listId, updateListSchema.parse(editList.value));
    list.value = updatedList;
    isEditListModalVisible.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

function openDeleteModal() {
  isDeleteModalVisible.value = true;
}

function closeDeleteModal() {
  isDeleteModalVisible.value = false;
}

async function deleteList() {
  loading.value = true;

  try {
    await listService.remove(listId);
    router.push({ name: "list-list", params: { userId: list.value?.userId } });
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

async function saveNewTodo() {
  loading.value = true;

  try {
    newTodo.value.createdAt = new Date();
    newTodo.value.updatedAt = new Date();

    createTodoSchema.parse(newTodo.value);
    await todoService.create(newTodo.value);
    todos.value = await todoService.findAll(listId);
    isNewTodoModalVisible.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}
</script>
