<template>
  <UForm :schema="localSchema" :state="localState" class="space-y-4" @submit="submitForm">
    <UFormField label="Title" name="title">
      <UInput v-model="localState.title" class="w-full" />
    </UFormField>
    <UFormField label="Description" name="description">
      <UInput v-model="localState.description" class="w-full" />
    </UFormField>
    <div class="grid grid-cols-2 gap-2">
      <UFormField label="Priority" name="priority">
        <USelect
          v-model="localState.priority"
          :items="priorityOptions"
          placeholder="Select a priority level"
          class="w-full"
        />
      </UFormField>
      <UFormField label="Due Date" name="dueDate">
        <UInput type="datetime-local" v-model="formattedDueDate" class="w-full" />
      </UFormField>
    </div>

    <UFormField
      class="w-full rounded-md border border-gray-300 py-3 ps-4 dark:border-zinc-700"
      name="completed"
    >
      <UCheckbox v-model="localState.completed" label="Completed" />
    </UFormField>
    <UButton type="submit" icon="flowbite:floppy-disk-alt-outline" loading-auto>Save</UButton>
  </UForm>
</template>

<script setup lang="ts">
import { Priority, type CreateTodo, type UpdateTodo } from "@/modules/todo/types/TodoTypes";
import { toSentenceCase } from "@/utils";
import dayjs from "dayjs";
import { computed, ref } from "vue";

const props = defineProps<{
  schema: unknown;
  state: CreateTodo | UpdateTodo;
  edit?: boolean;
}>();

const emit = defineEmits(["submitForm"]);

const localState = ref<CreateTodo | UpdateTodo>({ ...props.state });

const localSchema = computed(() => {
  return props.schema;
});

const priorityOptions = Object.values(Priority).map((priority) => ({
  label: toSentenceCase(priority),
  value: priority,
}));

const formattedDueDate = computed({
  get() {
    if (!localState.value.dueDate) return "";

    return dayjs(localState.value.dueDate).local().format("YYYY-MM-DDTHH:mm");
  },
  set(value) {
    if (!value) {
      localState.value.dueDate = undefined;
      return;
    }

    localState.value.dueDate = dayjs(value).utc().toDate();
  },
});

function submitForm() {
  if (props.edit) {
    Object.assign(props.state, localState.value);
  }

  emit("submitForm", localState.value);
}
</script>
