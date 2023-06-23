<template>
  <div class="col-md-8 col-lg-6">
    <h1 class="mb-3">Register</h1>
    <form @submit.prevent="onFormSubmit" >
      <div class="row">
        <div class="col-12 mb-4">
          <div class="form-outline">
            <input
              type="text"
              id="pictureUrl"
              v-model="pictureUrl"
              class="form-control"
            />
            <label class="form-label" for="pictureUrl">Picture Url</label>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="form-outline">
            <input
              type="text"
              id="firstname"
              v-model="firstName"
              class="form-control"
            />
            <label class="form-label" for="firstname">First name</label>
          </div>
        </div>
        <div class="col-md-6 mb-4">
          <div class="form-outline">
            <input
              type="text"
              id="lastname"
              v-model="lastName"
              class="form-control"
            />
            <label class="form-label" for="lastname">Last name</label>
          </div>
        </div>
      </div>

      <!-- Email input -->
      <div class="form-outline mb-4">
        <input type="email" id="email" v-model="email" class="form-control" />
        <label class="form-label" for="email">Email address</label>
      </div>

      <!-- Password input -->
      <div class="form-outline mb-4">
        <input
          type="password"
          id="password"
          v-model="password"
          class="form-control"
        />
        <label class="form-label" for="password">Password</label>
      </div>

      <!-- Submit button -->
      <button type="submit" class="btn btn-primary btn-block mb-4 w-100">
        Sign up
      </button>

      <!-- Login buttons -->
      <div class="text-center">
        <p>
          Already a member?
          <router-link :to="{ name: 'Login' }">Sign In</router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
  import { ref, onMounted } from "vue";
  import { registerUser } from "@/services/api";
  import store from "@/store/store";
  import router from "@/router";

  const email = ref("");
  const password = ref("");
  const firstName = ref("");
  const lastName = ref("");
  const pictureUrl = ref("");

  onMounted(() => {
    if (store.getters.user != null) {
      router.push({ name: "Dashboard" });
    }
  });

  const register = async () => {
    const user = {
      email: email.value,
      password: password.value,
      first_name: firstName.value,
      last_name: lastName.value,
      picture: pictureUrl.value,
    };

    try {
      const response = await registerUser(user);
      const { token, email, picture, _id } = response;
      const userData = {
        token,
        _id,
        email,
        pictureUrl: picture,
      };

      // Save user data to local storage
      localStorage.setItem("userData", JSON.stringify(userData));

      // Update the user store with the registered user data
      store.commit("setUser", userData);

      router.push({ name: "Dashboard" });
    } catch (error) {
      alert("Error registering user");
    }
  };

  const onFormSubmit = () => {
    register();
  };
</script>
