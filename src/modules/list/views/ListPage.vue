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
        <div class="flex justify-end">
          <ButtonComponent
            color="secondary"
            @click="() => router.push({ name: 'todo-list', params: { listId } })"
          >
            See To Do List
          </ButtonComponent>
        </div>
      </CardComponent>
    </div>
  </div>
  <ModalComponent v-if="isModalVisible && editedList">
    <template #header>
      <h1>Edit List</h1>
    </template>
    <template #body>
      <div class="space-y-2">
        <InputComponent v-model="editedList.title" label="Title" />
      </div>
      <div class="flex justify-end gap-2">
        <ButtonComponent color="secondary" @click="() => (isModalVisible = false)">
          Cancel
        </ButtonComponent>
        <ButtonComponent :disabled="loading" icon="flowbite:floppy-disk-alt-outline" @click="save">
          {{ loading ? "Saving..." : "Save" }}
        </ButtonComponent>
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
import router from "@/router";
import { defineAsyncComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { z } from "zod";

const ModalComponent = defineAsyncComponent(() => import("@/components/modal/ModalComponent.vue"));

const route = useRoute();

const listService = ListService.getInstance();

const loading = ref<boolean>(false);
const isModalVisible = ref<boolean>(false);

const listId = route.params.id as string;

const list = ref<ListId | undefined>();
const editedList = ref<UpdateList | undefined>();

const createUserSchema = z.object({
  title: z.string().nonempty("Title is required"),
});

onMounted(async () => {
  try {
    list.value = await listService.findOne(listId);
  } catch (error) {
    console.error(error);
  }
});

function openEditModal() {
  editedList.value = list.value ? JSON.parse(JSON.stringify(list.value)) : undefined;
  isModalVisible.value = true;
}

async function save() {
  loading.value = true;

  try {
    const updatedList = await listService.update(listId, createUserSchema.parse(editedList.value));
    list.value = updatedList;
    isModalVisible.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}
</script>
