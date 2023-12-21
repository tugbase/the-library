<template>
  <teleport to="body">
    <div v-if="show" @click="close" class="backdrop"></div>
    <transition name='dialog'>
      <dialog open v-if="show">
        <header>
          <slot name="header">
            <h2>{{ title }}</h2>
          </slot>
        </header>
        <section>
          <form class="form" @submit.prevent="submitReview">
            <div class="form-control">
              <label>Please add your review!</label>
              <textarea rows="7" v-model="review"></textarea>
            </div>
            <div class="submit-button">
              <button-template @submit="submitReview">Add review</button-template>
            </div>

          </form>
        </section>
        <menu v-if="!fixed">
          <slot name="actions">
            <button-template @click="close">Close</button-template>

          </slot>
        </menu>
      </dialog>
    </transition>
  </teleport>
</template>
<script setup>
import ButtonTemplate from "@/views/ButtonTemplate.vue";
import {ref} from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  fixed: {
    type: Boolean,
    required: false,
    default: false
  }
});
const emits = defineEmits(['close', 'review']);

const review = ref('');

function close() {
  if(props.fixed) {
    return;
  }
  emits('close');
}

function submitReview() {
  emits('review',review.value);
  review.value = '';
}

</script>






<style scoped>
@import "../../assets/components.scss";

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}

textarea {
  display: block;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  font: inherit;
  text-indent: 0.5rem;
}


textarea:focus {
  background-color: #f0e6fd;
  outline: none;
  border-color: #3d008d;
}




@media (min-width: 768px) {
  dialog {
    left: calc(50% - 20rem);
    width: 40rem;
  }
}
</style>