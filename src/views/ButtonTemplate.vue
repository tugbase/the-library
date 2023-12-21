<template>
  <button v-if='!link' :class='mode'>
    <slot></slot>
  </button>
  <router-link :to='to' v-else>
    <slot></slot>
  </router-link>
</template>

<script lang="ts">
export default {
  props: {
    link: {
      type: Boolean,
      required: false,
      default: false
    },
    to: {
      type: String,
      required: false,
      default: '/'
    },
    mode: {
      type: String,
      required: false,
      default: null
    }
  },

}
</script>

<style scoped lang="scss">
@import "../assets/global";
button,
a {
  text-decoration: none;
  text-transform: uppercase;
  text-align: center;
  padding: 1rem 2rem;
  font: inherit;
  background-color: $color-primary-dark;
  border: 1px solid $color-primary-dark;
  color: white;
  cursor: pointer;
  border-radius: 30px;
  margin-right: 0.5rem;
  transition: all 0.2s;
  @media only screen and (max-width: $bp-lg){
    padding: 1rem;
    text-align: center;
    margin-right: unset;
    font-size: 0.8rem;
  }
}

a:hover,
a:active,
button:hover,
button:active {
  transform: scale(1.04);
  background-color: $color-primary-dark-2;
  border-color: $color-primary-dark-2;
  @media only screen and (max-width: $bp-lg){
    transform: unset;

  }
}

.flat {
  background-color: transparent;
  color: $cadmium-green;
  border: none;
}

.outline {
  background-color: transparent;
  border-color: $hunter-green;
  color: $hunter-green;
}

.flat:hover,
.flat:active,
.outline:hover,
.outline:active {
  background-color: #E6E6FA;
}
</style>