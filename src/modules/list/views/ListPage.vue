<template>
  <div v-if="!list">
    <LoadingComponent />
  </div>
  <div v-else>
    <TitleComponent
      class="mb-2"
      icon="flowbite:edit-outline"
      show-back-button
      @right-button:clicked="openEditModal"
      @back-button:clicked="
        () => router.push({ name: 'list-list', params: { userId: list?.userId } })
      "
    >
      <template #title>List Details</template>
      <template #button>Edit</template>
    </TitleComponent>
    <div class="space-y-2">
      <CardComponent padding="sm">
        <div class="grid w-fit grid-cols-2">
          <div class="font-semibold">Title:</div>
          <div>{{ list.title }}</div>
          <div class="font-semibold">Created At:</div>
          <div>{{ new Date(list.createdAt).toLocaleString() }}</div>
          <div class="font-semibold">Updated At:</div>
          <div>{{ new Date(list.updatedAt).toLocaleString() }}</div>
        </div>
        <div class="flex justify-end gap-2">
          <ButtonComponent icon="flowbite:trash-bin-outline" color="danger" @click="deleteList">
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
  <ModalComponent v-if="isEditListModalVisible && editedList">
    <template #header>
      <h1>Edit List</h1>
    </template>
    <template #body>
      <div class="space-y-2">
        <InputComponent v-model="editedList.title" label="Title" />
      </div>
      <div class="flex justify-end gap-2">
        <ButtonComponent color="secondary" @click="() => (isEditListModalVisible = false)">
          Cancel
        </ButtonComponent>
        <ButtonComponent :disabled="loading" icon="flowbite:floppy-disk-alt-outline" @click="save">
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
      <!-- <div class="space-y-2">
        <InputComponent v-model="newTodo.title" label="Title" />
        <InputComponent v-model="newTodo.description" label="Description" />
        <InputComponent v-model="newTodo.dueDate" type="date" label="Due Date" />
        <InputComponent v-model="newTodo.priority" type="number" label="Priority" />
      </div> -->
      <div class="flex justify-end gap-2">
        <ButtonComponent color="secondary" @click="closeNewTodoModal">Cancel</ButtonComponent>
        <!-- <ButtonComponent
          :disabled="loading"
          icon="flowbite:floppy-disk-alt-outline"
          @click="saveNewTodo"
        >
          {{ loading ? "Saving..." : "Save" }}
        </ButtonComponent> -->
      </div>
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
import ButtonComponent from "@/components/button/ButtonComponent.vue";
import CardComponent from "@/components/card/CardComponent.vue";
import InputComponent from "@/components/input/InputComponent.vue";
import LoadingComponent from "@/components/loading/LoadingComponent.vue";
import TitleComponent from "@/components/title/TitleComponent.vue";
import ListService from "@/modules/list/services/ListService";
import type { ListId, UpdateList } from "@/modules/list/types/ListTypes";
import TodoService from "@/modules/todo/services/TodoService";
import { type TodoId } from "@/modules/todo/types/TodoTypes";
import router from "@/router";
import { defineAsyncComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { z } from "zod";

const ModalComponent = defineAsyncComponent(() => import("@/components/modal/ModalComponent.vue"));

const route = useRoute();

const listService = ListService.getInstance();
const todoService = TodoService.getInstance();

const loading = ref<boolean>(false);
const isEditListModalVisible = ref<boolean>(false);
const isNewTodoModalVisible = ref<boolean>(false);

const listId = route.params.id as string;

const list = ref<ListId | undefined>();
const editedList = ref<UpdateList | undefined>();
const todos = ref<TodoId[] | undefined>();
// const newTodo = ref<CreateTodo>({
//   title: "",
//   description: "",
//   dueDate: new Date(),
//   priority: Priority.LOW,
//   completed: false,
//   createdAt: new Date(),
//   updatedAt: new Date(),
//   listId,
// });

const createUserSchema = z.object({
  title: z.string().nonempty("Title is required"),
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
  editedList.value = list.value ? JSON.parse(JSON.stringify(list.value)) : undefined;
  isEditListModalVisible.value = true;
}

function openNewModal() {
  isNewTodoModalVisible.value = true;
}

function closeNewTodoModal() {
  isNewTodoModalVisible.value = false;
}

async function save() {
  loading.value = true;

  try {
    const updatedList = await listService.update(listId, createUserSchema.parse(editedList.value));
    list.value = updatedList;
    isEditListModalVisible.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

async function deleteList() {
  try {
    await listService.remove(listId);
    router.push({ name: "list-list", params: { userId: list.value?.userId } });
  } catch (error) {
    console.error(error);
  }
}
</script>
