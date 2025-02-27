<template>
  <div v-if="!lists">
    <LoadingComponent />
  </div>
  <div v-else>
    <h1 class="mb-2">List</h1>
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
  </div>
</template>

<script setup lang="ts">
import CardComponent from "@/components/card/CardComponent.vue";
import LoadingComponent from "@/components/loading/LoadingComponent.vue";
import ListService from "@/modules/list/services/ListService";
import type { ListId } from "@/modules/list/types/ListTypes";
import router from "@/router";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const listService = ListService.getInstance();

const userId = route.params.userId as string;

const lists = ref<ListId[] | undefined>();

onMounted(async () => {
  try {
    lists.value = await listService.findAll(userId);
  } catch (error) {
    console.error(error);
  }
});
</script>
