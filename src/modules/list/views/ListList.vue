<template>
  <div v-if="!lists">
    <LoadingComponent />
  </div>
  <div v-else>
    <TitleComponent class="mb-2" icon="flowbite:plus-outline" @right-button:clicked="openNewModal">
      <template #title>List</template>
      <template #button>New</template>
    </TitleComponent>
    <div class="space-y-2">
      <CardComponent
        v-for="list in lists"
        :key="list.id"
        @click="() => router.push({ name: 'list-page', params: { id: list.id } })"
        padding="sm"
        hover
      >
        <h3>{{ list.title }}</h3>
      </CardComponent>
    </div>
    <ModalComponent v-if="isModalVisible">
      <template #header>
        <h1>New List</h1>
      </template>
      <template #body>
        <div class="space-y-2">
          <InputComponent v-model="newList.title" label="Title" />
        </div>
        <div class="flex justify-end gap-2">
          <ButtonComponent color="secondary" @click="closeNewModal">Cancel</ButtonComponent>
          <ButtonComponent
            :disabled="loading"
            name="flowbite:floppy-disk-alt-outline"
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
import InputComponent from "@/components/input/InputComponent.vue";
import LoadingComponent from "@/components/loading/LoadingComponent.vue";
import TitleComponent from "@/components/title/TitleComponent.vue";
import ListService from "@/modules/list/services/ListService";
import type { CreateList, ListId } from "@/modules/list/types/ListTypes";
import { defineAsyncComponent, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { z } from "zod";

const ModalComponent = defineAsyncComponent(() => import("@/components/modal/ModalComponent.vue"));

const route = useRoute();
const router = useRouter();

const listService = ListService.getInstance();

const userId = route.params.userId as string;

const lists = ref<ListId[] | undefined>();
const newList = ref<CreateList>({
  title: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  userId,
});

const loading = ref<boolean>(false);
const isModalVisible = ref<boolean>(false);

const createUserSchema = z.object({
  title: z.string().nonempty("Title is required"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

onMounted(async () => {
  try {
    lists.value = await listService.findAll(userId);
  } catch (error) {
    console.error(error);
  }
});

function openNewModal() {
  isModalVisible.value = true;
}

function closeNewModal() {
  isModalVisible.value = false;
  newList.value.title = "";
}

async function save() {
  loading.value = true;

  try {
    newList.value.createdAt = new Date();
    newList.value.updatedAt = new Date();

    createUserSchema.parse(newList.value);
    await listService.create(newList.value);
    lists.value = await listService.findAll(userId);
    isModalVisible.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}
</script>
