<template>
  <div v-if="!list">
    <LoadingComponent />
  </div>
  <div v-else>
    <div class="mb-2 flex justify-between">
      <h1>List Details</h1>
      <ButtonComponent icon="flowbite:edit-outline" variant="primary" @click="openEditModal">
        Edit
      </ButtonComponent>
    </div>
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
      </CardComponent>
    </div>
  </div>
  <ModalComponent v-if="isModalVisible && editedList">
    <template #header>
      <h1>Edit List</h1>
    </template>
    <template #body>
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <InputComponent v-model="editedList.title" label="Title" />
        </div>
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
import ListService from "@/modules/list/services/ListService";
import type { ListId } from "@/modules/list/types/ListTypes";
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
const editedList = ref<ListId | undefined>();

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
