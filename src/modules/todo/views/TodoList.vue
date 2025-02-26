<template>
  <div v-if="!todos">
    <LoadingComponent />
  </div>
  <div v-else>
    <h1>Todo List</h1>
    <div class="space-y-2">
      <CardComponent
        v-for="todo in todos"
        :key="todo.id"
        @click="() => router.push({ name: 'todo-page', params: { listId, todoId: todo.id } })"
        padding="sm"
        hover
      >
        <h3>{{ todo.title }}</h3>
        <h6 v-if="todo.description">{{ todo.description }}</h6>
      </CardComponent>
    </div>
  </div>
</template>

<script setup lang="ts">
import CardComponent from "@/components/card/CardComponent.vue";
import LoadingComponent from "@/components/loading/LoadingComponent.vue";
import TodoService from "@/modules/todo/services/TodoService";
import type { TodoId } from "@/modules/todo/types/TodoTypes";
import router from "@/router";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const todoService = TodoService.getInstance();

const listId = route.params.listId as string;

const todos = ref<TodoId[] | undefined>();

onMounted(async () => {
  try {
    todos.value = await todoService.findAll(listId);
  } catch (error) {
    console.error(error);
  }
});
</script>
