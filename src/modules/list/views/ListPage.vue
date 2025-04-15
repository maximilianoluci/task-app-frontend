<template>
  <div v-if="!list">
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
        <h1>List Details</h1>
      </div>
      <UModal title="Edit List" description="Edit the list" v-model:open="isEditListModalOpen">
        <UButton icon="flowbite:edit-outline">Edit</UButton>

        <template #body>
          <UForm
            :schema="updateListSchema"
            :state="updateListState"
            class="space-y-4"
            @submit="saveList"
          >
            <UFormField label="Title" name="title">
              <UInput v-model="updateListState.title" class="w-full" />
            </UFormField>

            <UButton type="submit" icon="flowbite:floppy-disk-alt-outline" loading-auto>
              Save
            </UButton>
          </UForm>
        </template>
      </UModal>
    </div>
    <div class="space-y-2">
      <UCard variant="subtle">
        <div class="grid w-fit grid-cols-2">
          <div class="font-semibold">Title:</div>
          <div>{{ list.title }}</div>
          <div class="font-semibold">Last Updated:</div>
          <div>{{ formatDate(list.updatedAt) }}</div>
        </div>
        <div class="flex justify-end gap-2">
          <UModal
            title="Delete List"
            description="Delete the list"
            v-model:open="isDeleteModalOpen"
          >
            <UButton icon="flowbite:trash-bin-outline" color="error">Delete</UButton>

            <template #body>
              <div class="space-y-4 text-center">
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
                <UButton
                  icon="flowbite:trash-bin-outline"
                  loading-auto
                  color="error"
                  @click="deleteList"
                >
                  Delete
                </UButton>
              </div>
            </template>
          </UModal>
        </div>
      </UCard>
      <div class="mb-2 flex justify-between">
        <h2>To Do List</h2>
        <UModal
          title="New To-do Item"
          description="Create a new to-do item"
          v-model:open="isNewTodoModalOpen"
        >
          <UButton icon="flowbite:plus-outline">New</UButton>

          <template #body>
            <TodoForm
              :schema="createTodoSchema"
              :state="createTodoState"
              @submit-form="saveNewTodo"
            />
          </template>
        </UModal>
      </div>
      <div class="space-y-2">
        <UCard
          v-for="todo in todos"
          :key="todo.id"
          class="cursor-pointer"
          variant="subtle"
          @click="() => router.push({ name: 'todo-page', params: { id: todo.id } })"
        >
          <h3>{{ todo.title }}</h3>
          <h6 v-if="todo.description">{{ todo.description }}</h6>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoadingComponent from "@/components/loading/LoadingComponent.vue";
import ListService from "@/modules/list/services/ListService";
import type { ListId, UpdateList } from "@/modules/list/types/ListTypes";
import TodoForm from "@/modules/todo/components/TodoForm.vue";
import TodoService from "@/modules/todo/services/TodoService";
import { Priority, type CreateTodo, type TodoId } from "@/modules/todo/types/TodoTypes";
import { formatDate } from "@/utils";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { z } from "zod";

dayjs.extend(utc);

const route = useRoute();
const router = useRouter();
const toast = useToast();

const listService = ListService.getInstance();
const todoService = TodoService.getInstance();

const isEditListModalOpen = ref<boolean>(false);
const isNewTodoModalOpen = ref<boolean>(false);
const isDeleteModalOpen = ref<boolean>(false);

const listId = route.params.id as string;

const list = ref<ListId | undefined>();

const updateListState = ref<UpdateList>({});

const updateListSchema = z.object({
  title: z.string().nonempty("Title is required"),
  updatedAt: z.date(),
});

const todos = ref<TodoId[] | undefined>();

const createTodoState = reactive<CreateTodo>({
  title: "",
  description: "",
  completed: false,
  dueDate: new Date(),
  priority: Priority.LOW,
  createdAt: new Date(),
  updatedAt: new Date(),
  listId,
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

    if (!list.value) return;

    updateListState.value = {
      title: list.value.title,
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error(error);
  }
});

function handleBackButtonClick() {
  if (!list.value) return;

  router.push({ name: "list-list", params: { userId: list.value.userId } });
}

function closeEditListModal() {
  isEditListModalOpen.value = false;
  updateListState.value.title = list.value ? list.value.title : "";
}

async function saveList() {
  try {
    updateListState.value.updatedAt = new Date();
    updateListSchema.parse(updateListState.value);

    const updatedListResponse = await listService.update(listId, updateListState.value);

    list.value = updatedListResponse;
    isEditListModalOpen.value = false;

    toast.add({
      title: "Success",
      description: "The list has been updated.",
      color: "success",
      icon: "flowbite:check-circle-outline",
    });

    closeEditListModal();
  } catch (error) {
    console.error(error);
  }
}

async function deleteList() {
  try {
    await listService.remove(listId);
    router.push({ name: "list-list", params: { userId: list.value?.userId } });
    isDeleteModalOpen.value = false;
  } catch (error) {
    console.error(error);
  }
}

async function saveNewTodo(newTodo: CreateTodo) {
  try {
    createTodoSchema.parse(newTodo);
    await todoService.create(newTodo);
    todos.value = await todoService.findAll(listId);

    toast.add({
      title: "Success",
      description: "The to-do item has been created.",
      color: "success",
      icon: "flowbite:check-circle-outline",
    });

    isNewTodoModalOpen.value = false;
  } catch (error) {
    console.error(error);
  }
}
</script>
