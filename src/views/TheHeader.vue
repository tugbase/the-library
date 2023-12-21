<template>
  <header>
    <nav class="navigation">

      <ul class="navigation__list">
        <li  class="main-page" >
          <router-link to="/">Find Your Life's Book</router-link>
        </li>
        <li>
          <router-link to='/books'>All Books</router-link>
        </li>
        <li v-if='auth.isAuthenticated'>
          <router-link to='/my-books'>My Books</router-link>
          </li>
        <li v-if="auth.isAuthenticated">
          <router-link to='/my-reviews'>My reviews</router-link>
        </li>
        <li v-if="auth.isAuthenticated">
          <router-link class="add-book" to='/add-book'>Add Book</router-link>
        </li>

        <li v-else>
          <router-link to='/auth'>Login / Signup</router-link>
        </li>
        <li v-if='auth.isAuthenticated'>
          <button-template class="logout" @click='logOut'>Logout</button-template>
        </li>
      </ul>

    </nav>

  </header>
</template>

<script>
import ButtonTemplate from "@/views/ButtonTemplate.vue";
import {userAuthStore} from "@/stores/auth";


export default {
  components: {ButtonTemplate},
  setup() {
    const auth = userAuthStore();

    return {auth};
  },
  methods: {
    logOut() {
      this.auth.logOut();
      this.$router.replace('/books');

    }
  }
}
</script>

<style scoped lang="scss">
@import "../assets/global";
header {
  margin-bottom: 8rem;
}

.navigation {
  width: 100%;
  background-color: #1f2635;
  position: fixed;
  top: 0;
  z-index: 10000;


  &__list {
    list-style: none;
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 2rem;
    align-items: center;
    margin: auto;
    text-align: center;
    @media only screen and (max-width: $bp-lg) {
      gap: 0;
      width: unset;
      margin: 0;
    }
    li {
      font-size: 0.8rem;
      cursor: pointer;
      z-index: 5;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 5rem;
      padding: 0 2rem;
      position: relative;
      transition: transform .2s,
      width .4s cubic-bezier(1,0,0,1) .2s,
      background-color .3s;
      a {
        height: 100%;
        display:flex;
        align-items: center;
        text-decoration: none;
        color: $white-rock;
        font-size: 1rem;
        &:hover {
          color: $color-grey-dark-3;
        }
        &:focus,
        &:active {
          color: $color-tertiary-light;
        }
        &:focus ~ li {
          background-color: white;
        }
        @media only screen and (max-width: $bp-md) {
          font-size: 0.7rem;
        }
      }

    }

  }
  @media only screen and (max-width: $bp-sm) {
    display: unset;
  }



}
li::before {
  content: "";
  position: absolute;
  top: 4.8rem;
  left: 0;
  height: 5px;
  width: 100%;
  background-color: $white-rock;
  transform: scaleX(0);
  transition: transform .2s,
  width .4s cubic-bezier(1,0,0,1) .2s,
  background-color .1s;
}
li:hover::before {
  transform: scaleX(1);
  color: $white-rock;


}
li:active::before {
  background-color: $white-rock;
}
li:hover {
  background-color: $color-grey-dark-2;

}

.main-page {
  margin-right: auto;

}
.logout {
  @media only screen and (max-width: $bp-md){
    padding: 0.5rem;
    border-radius: unset;
    font-size: 0.6rem;
    margin-right: 0.1rem;
  }
}
.add-book {
  @media only screen and (max-width: $bp-md) {
    display: none;
  }
}




</style>