<template>
  <div class="container">
    <div class="row">
      <div class="col-12 col-md-8 col-lg-6 mx-auto">
        <header class="d-flex justify-content-between align-items-center mb-3">
          <h1 class="display-1 fw-bold">TodoList</h1>
          <div>
            <button @click="deleteAll" class="btn btn-sm btn-danger">
              Delete All
            </button>
            <button @click="logout" class="btn btn-sm btn-warning ms-2">
              Logout
            </button>
          </div>
        </header>
        <form class="mb-3" @submit.prevent="addTodo">
          <div class="row">
            <input
              name="todo-input"
              id="todo-input"
              class="form-control col-auto me-2 mb-2"
              placeholder="Be Amazing!"
              v-model="newTodo"
              @keydown.enter="addTodoOnEnter"
            />
            <button class="btn btn-sm btn-primary col-auto" type="submit">
              Add Todo
            </button>
          </div>
        </form>
        <div class="showTodo">
          <div class="bg-light rounded px-2" v-if="todoList.length > 0">
            <div
              class="d-flex justify-content-between align-items-center bg-light border-bottom py-2 text-dark"
              v-for="(todo, index) in todoList"
              :key="index"
            >
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :value="todo.completed"
                  id="flexCheckDefault"
                  @change="checkCompleted(index)"
                  :checked="getCheckboxChecked(todo.completed)"
                />
              </div>
              <div class="">{{ todo.task }}</div>
              <div class="">
                <button
                  @click="deleteTodoTask(index)"
                  class="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import store from "@/store/store";
import router from "@/router";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  deleteAllTodos,
} from "../services/api";

const todoList = ref([]);
const newTodo = ref("");

onMounted(() => {
  const storedUserData = localStorage.getItem("userData");
  if (!storedUserData) {
    router.push({ name: "Login" });
    return;
  }

  try {
    const userData = JSON.parse(storedUserData);

    // Check if the user state is already populated
    if (!store.getters.user) {
      console.log(
        "User state not populated, initializing it with data from local storage"
      );
      // If not, initialize it with the data from local storage
      store.commit("setUser", userData);
    }

    fetchTodos(userData.token, userData._id);
  } catch (error) {
    console.error("Error parsing user data:", error);
    router.push({ name: "Login" });
  }
});

const fetchTodos = async (token, userId) => {
  try {
    const res = await getTodos(token, userId);
    todoList.value = res;
  } catch (error) {
    console.error("Error fetching todos:", error);
    alert("Failed to fetch todos. Please try again later.");
  }
};

const getCheckboxChecked = (completed) => {
  return completed;
};

const addTodo = async () => {
  if (!newTodo.value) return;

  const todo = {
    task: newTodo.value,
    completed: false,
    created_at: Date.now(),
    completed_time: null,
  };

  try {
    await createTodo(todo, store.getters.user.token, store.getters.user._id);
    fetchTodos(store.getters.user.token, store.getters.user._id);
    newTodo.value = "";
    alert("Todo added successfully");
  } catch (error) {
    console.error("Error adding todo:", error);
    alert("Failed to add todo. Please try again later.");
  }
};

const addTodoOnEnter = (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addTodo();
  }
};

const checkCompleted = async (index) => {
  const todo = todoList.value[index];
  todo.completed = !todo.completed;

  try {
    await updateTodo(todo, store.getters.user.token);
    alert("Todo updated successfully");
  } catch (error) {
    console.error("Error updating todo:", error);
    alert("Failed to update todo. Please try again later.");
  }
};

const deleteTodoTask = async (index) => {
  try {
    // console.log(store.getters.user.token);
    await deleteTodo(todoList.value[index]._id, store.getters.user.token);
    todoList.value.splice(index, 1);
    alert("Todo deleted successfully");
  } catch (error) {
    console.error("Error deleting todo:", error);
    alert("Failed to delete todo. Please try again later.");
  }
};

const deleteAll = async () => {
  try {
    await deleteAllTodos(store.getters.user.token, store.getters.user._id);
    todoList.value = [];
    alert("All todos deleted successfully");
  } catch (error) {
    console.error("Error deleting todos:", error);
    alert("Failed to delete todos. Please try again later.");
  }
};

const logout = () => {
  localStorage.removeItem("userData");
  store.commit("setUser", null);
  router.push({ name: "Login" });
};
</script>

<style scoped>
h1 {
  font-size: 1.2rem;
}
</style>
