<template>
  <div v-if="!todo">
    <LoadingComponent />
  </div>
  <div v-else>
    <h1 class="mb-2">Todo Details</h1>
    <div class="space-y-2">
      <CardComponent padding="sm">
        <div class="grid w-fit grid-cols-2">
          <div class="font-semibold">Title:</div>
          <div>{{ todo.title }}</div>
          <div class="font-semibold">Description:</div>
          <div>{{ todo.description || "-" }}</div>
          <div class="font-semibold">Due Date:</div>
          <div>{{ todo.dueDate ? new Date(todo.dueDate).toLocaleString() : "-" }}</div>
          <div class="font-semibold">Completed:</div>
          <div>{{ todo.completed ? "Yes" : "No" }}</div>
          <div class="font-semibold">Priority:</div>
          <div>{{ todo.priority }}</div>
          <div class="font-semibold">Created At:</div>
          <div>{{ new Date(todo.createdAt).toLocaleString() }}</div>
          <div class="font-semibold">Updated At:</div>
          <div>{{ new Date(todo.updatedAt).toLocaleString() }}</div>
        </div>
      </CardComponent>
    </div>
  </div>
</template>

<script setup lang="ts">
import CardComponent from "@/components/card/CardComponent.vue";
import LoadingComponent from "@/components/loading/LoadingComponent.vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import TodoService from "../services/TodoService";
import type { TodoId } from "../types/TodoTypes";

const route = useRoute();

const todoService = TodoService.getInstance();

const todoId = route.params.todoId as string;

const todo = ref<TodoId | undefined>();

onMounted(async () => {
  try {
    todo.value = await todoService.findOne(todoId);
  } catch (error) {
    console.error(error);
  }
});
</script>
