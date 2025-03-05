<template>
  <div class="space-y-2">
    <InputComponent v-model="localEditTodo.title" label="Title" />
    <InputComponent v-model="localEditTodo.description" label="Description" />
    <div class="flex gap-2">
      <SelectComponent
        class="w-1/2"
        v-model="localEditTodo.priority"
        :options="priorityOptions"
        placeholder="Select a priority level"
        label="Priority"
      />
      <DateTimeComponent class="w-1/2" v-model="localEditTodo.dueDate" label="Due Date" />
    </div>
    <CheckboxComponent v-model="localEditTodo.completed" bordered>Completed</CheckboxComponent>
  </div>
  <div class="flex justify-end gap-2">
    <ButtonComponent color="secondary" @click="emit('cancel')"> Cancel </ButtonComponent>
    <ButtonComponent
      :disabled="loading"
      icon="flowbite:floppy-disk-alt-outline"
      @click="emit('save', localEditTodo)"
    >
      {{ loading ? "Saving..." : "Save" }}
    </ButtonComponent>
  </div>
</template>

<script setup lang="ts">
import ButtonComponent from "@/components/button/ButtonComponent.vue";
import CheckboxComponent from "@/components/checkbox/CheckboxComponent.vue";
import DateTimeComponent from "@/components/date-time/DateTimeComponent.vue";
import InputComponent from "@/components/input/InputComponent.vue";
import SelectComponent from "@/components/select/SelectComponent.vue";
import { Priority, type UpdateTodo } from "@/modules/todo/types/TodoTypes";
import { ref, watch } from "vue";

const { editTodo, loading } = defineProps<{
  editTodo: UpdateTodo;
  loading?: boolean;
}>();

const emit = defineEmits(["cancel", "save"]);

const localEditTodo = ref<UpdateTodo>({ ...editTodo });

watch(
  () => editTodo,
  (newEditTodo) => {
    localEditTodo.value = { ...newEditTodo };
  },
  { deep: true },
);

const priorityOptions = Object.values(Priority).map((value) => ({
  name: value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
  value,
}));
</script>
