<template>
  <div class="container">
    <div class="row">
      <div class="col-12 col-md-8 col-lg-6 mx-auto">
        <header class="d-flex justify-content-between align-items-center mb-3">
          <h1 class="display-1 fw-bold">TodoList</h1>
          <button @click="deleteAll" class="btn btn-sm btn-danger">
            Delete All
          </button>
        </header>
        <form class="mb-3" @submit.prevent="addTodo">
          <div class="row">
            <input
              name="todo-input"
              id="todo-input"
              class="form-control col-auto me-2 mb-2"
              placeholder="Be Amazing!"
              v-model="newTodo"
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
import { getTodos, createTodo, updateTodo, deleteTodo, deleteAllTodos } from "../services/api";
const todoList = ref([]);
const newTodo = ref("");

onMounted(() => {
  if(store.getters.user == null) return router.push({ name: "Login" })

  getTodos(store.getters.user.token, store.getters.user._id).then((res) => {
    todoList.value = res;
    // console.log(todoList.value)
  });
});

const getCheckboxChecked = (completed) => {
  if (completed) return true;
  return false;
};

const addTodo = async () => {
  if (!newTodo.value) return;
  const todo = { task: newTodo.value, completed: false, created_at: Date.now(), completed_time: null, }
  try {
    
    await createTodo(todo, store.getters.user.token, store.getters.user._id)
    todoList.value.push(todo);
    newTodo.value = "";
    alert('todo added')
    // console.log(todoList.value);
    todoList.value.forEach(element => {
      console.log(element.task)
    });
  } catch (error) {
    alert(error.message)
  }
};

const checkCompleted = async (index) => {
  const todo = todoList.value[index]
  todo.completed = !todo.completed
  // console.log(todo.completed)
  try {
    await updateTodo(todo, store.getters.user.token)
    alert('todo updated')
    // todoList.value[index].completed = !todoList.value[index].completed;
  } catch (error) {
    var errorMsg = document.getElementById("errorMsg");
    errorMsg.innerHTML = "Error updating todo";
    alert('error updating todo task')
  }
};

const deleteTodoTask = async (index) => {
  try {
    await deleteTodo(todoList.value[index]._id, store.getters.user.token)
    todoList.value.splice(index, 1);
    alert('todo deleted')
  } catch (error) {
    alert('error deleting item')
  }
};

const deleteAll = async () => {
  try {
    await deleteAllTodos(store.getters.user.token, store.getters.user._id)
    todoList.value = [];
    alert('all todos deleted')
  } catch (error) {
    alert('error deleting todos')
  }
};
</script>

<style scoped>
h1 {
  font-size: 1.2rem;
}
</style>
