<template>
  <div class="col-md-8 col-lg-6">
    <h1 class="mb-3">Login</h1>
    <form @submit.prevent="onFormSubmit()">
      <!-- Email input -->
      <div class="form-outline mb-4">
        <input
          type="email"
          id="form2Example1"
          v-model="email"
          class="form-control"
        />
        <label class="form-label" for="form2Example1">Email address</label>
      </div>

      <!-- Password input -->
      <div class="form-outline mb-4">
        <input
          type="password"
          id="form2Example2"
          v-model="password"
          class="form-control"
        />
        <label class="form-label" for="form2Example2">Password</label>
      </div>

      <!-- Submit button -->
      <button type="submit" class="btn btn-primary btn-block mb-4 w-100">
        Sign in
      </button>

      <!-- Register buttons -->
      <div class="text-center">
        <p>
          Not a member?
          <router-link :to="{ name: 'Register' }">Register</router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
  import { onMounted, ref } from "vue";
  import { loginUser } from "@/services/api";
  import store from "@/store/store";
  import router from "@/router";

  const email = ref("");
  const password = ref("");

  onMounted(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      store.commit("setUser", userData);
      router.push({ name: "Dashboard" });
    }
  });

  const login = async () => {
    const user = {
      email: email.value,
      password: password.value,
    };

    try {
      const response = await loginUser(user);
      const { token, email, picture, _id } = response;
      const userData = {
        token,
        _id,
        email,
        pictureUrl: picture,
      };

      // Save user data in localStorage
      localStorage.setItem("userData", JSON.stringify(userData));

      // Set the user state in the Vuex store
      store.commit("setUser", userData);

      // Redirect to dashboard
      router.push({ name: "Dashboard" });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const onFormSubmit = () => {
    console.log("onFormSubmit");
    login();
  };
</script>
