<template>
  <div v-if="!lists">
    <LoadingComponent />
  </div>
  <div v-else>
    <div class="mb-2 flex justify-between">
      <h1>List</h1>
      <UModal title="New List" description="Create a new list">
        <UButton icon="flowbite:plus-outline">New</UButton>

        <template #body>
          <UForm :schema :state class="space-y-4" @submit="save">
            <UFormField label="Title" name="title">
              <UInput v-model="state.title" class="w-full" />
            </UFormField>

            <UButton type="submit" icon="flowbite:floppy-disk-alt-outline" loading-auto>
              Save
            </UButton>
          </UForm>
        </template>
      </UModal>
    </div>
    <div class="space-y-2">
      <UCard
        v-for="list in lists"
        :key="list.id"
        class="cursor-pointer"
        variant="soft"
        @click="() => router.push({ name: 'list-page', params: { id: list.id } })"
      >
        <h3>{{ list.title }}</h3>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoadingComponent from "@/components/loading/LoadingComponent.vue";
import ListService from "@/modules/list/services/ListService";
import type { CreateList, ListId } from "@/modules/list/types/ListTypes";
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { z } from "zod";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const listService = ListService.getInstance();

const userId = route.params.userId as string;

const lists = ref<ListId[] | undefined>();

const state = reactive<CreateList>({
  title: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  userId,
});

const schema = z.object({
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

async function save() {
  try {
    schema.parse(state);
    await listService.create(state);
    lists.value = await listService.findAll(userId);
    toast.add({
      title: "Success",
      description: "The list has been created.",
      color: "success",
      icon: "flowbite:check-circle-outline",
    });
    state.title = "";
  } catch (error) {
    console.error(error);
  }
}
</script>
