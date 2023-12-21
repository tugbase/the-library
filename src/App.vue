

<template>
<the-header></the-header>
  <router-view v-slot="slotProps">
    <transition name='route' mode='out-in'>
      <component :is='slotProps.Component'></component>
    </transition>
  </router-view>
</template>
<script>
import TheHeader from "@/views/TheHeader.vue";
import {userAuthStore} from "@/stores/auth";
import { useRouter } from "vue-router";


export default {
  components: {TheHeader},
  setup() {
    const auth = userAuthStore();
    return {auth}
  },
  created() {
    this.auth.tryLogin();
  },
  computed: {
    didAutoLogOut() {
      return this.auth.isAutoLoggedOut;
    },

  },
  watch : {
    didAutoLogout(curValue, oldValue) {

      if(curValue && curValue !== oldValue) {
        this.$router.replace('/auth');
      }
    }
  }
}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");
@import "assets/global.scss";

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: inherit;
}

html {
  box-sizing: border-box;
  font-size: $default-font-size;
  scroll-behavior: smooth;
}

body {
  font-family: $font-primary;
  color: $color-grey-dark-2;
  font-weight: 300;
  line-height: 1.6;
  box-sizing: inherit;
}

.route-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.route-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.route-enter-active {
  transition: all 0.3s ease-out;
}

.route-leave-active {
  transition: all 0.3s ease-in;
}

.route-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.route-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
