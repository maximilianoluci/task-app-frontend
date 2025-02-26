<template>
  <div v-if="!todos">
    <LoadingComponent />
  </div>
  <div v-else>
    <h1>Todo List</h1>
    <ul>
      <li v-for="todo in todos" :key="todo.id" class="mb-2">
        <h3>{{ todo.title }}</h3>
        <h6 v-if="todo.description">{{ todo.description }}</h6>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import LoadingComponent from "@/components/loading/LoadingComponent.vue";
import TodoService from "@/modules/todo/services/TodoService";
import type { TodoId } from "@/modules/todo/types/TodoTypes";
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
