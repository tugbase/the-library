<template>
  <book-card>
    <form @submit.prevent='submitForm'>
      <div class='form-control'>
        <label for='email'>E-Mail</label>
        <input type='email' id='email' v-model.trim='userEmail'>
      </div>
      <div class='form-control'>
        <label for='password'>Password</label>
        <input type='password' id='password' v-model.trim='password'>
      </div>
      <p v-if='!formIsValid'> Please enter a valid email and password </p>
      <button-template class="login-button" @submit='submitForm'>{{ submitButtonTitle }}</button-template>
      <button-template type='button' mode='flat' @click='switchAuthMode'>{{ switchModeButtonCaption }}</button-template>
    </form>
    <load-spinner v-if="isLoading"></load-spinner>
  </book-card>

</template>
<script setup lang="ts">
import BookCard from "@/views/BookCard.vue";
import {computed, ref} from "vue";
import ButtonTemplate from "@/views/ButtonTemplate.vue";
import {userAuthStore} from "@/stores/auth";
import {useRouter } from "vue-router";
import LoadSpinner from "@/views/LoadSpinner.vue";


const userEmail = ref('');
const password = ref('');
const formIsValid = ref(true);
const mode = ref('login');
const isLoading = ref(false);
const auth = userAuthStore();
const router = useRouter();
const submitButtonTitle = computed(() => {

    if (mode.value === 'login') {
      return 'LOGIN';
    } else {
      return 'SIGNUP';
    }

});

const switchModeButtonCaption = computed(() => {
  if(mode.value === 'login'){
    return 'Are not you a member ? Signup!';
  } else {
    return 'Are you already a member ? Login!'
  }
});

function switchAuthMode() {
  if (mode.value === 'login') {
    mode.value = 'signup';
  } else {
    mode.value = 'login';
  }
}


async function submitForm() {

  formIsValid.value = true;
  if(userEmail.value === '' || !userEmail.value.includes('@') || password.value.length < 6){
    formIsValid.value = false;
    return;
  }
  const data = {
    userEmail: userEmail.value,
    password: password.value
  };
    isLoading.value = true;
    if (mode.value === 'login') {
      await auth.login(data);
    } else {

      await auth.signUp(data);
    }
  isLoading.value = false;
  router.replace('/books');
}

</script>

<style scoped lang="scss">
@import "../../assets/global";
form {
  margin: 1rem;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}
.login-button {
  @media only screen and (max-width: $bp-md) {
    width: 100%;
    margin-top: 1rem;
  }

}
</style>