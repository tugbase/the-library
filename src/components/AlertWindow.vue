<template>
  <teleport to="body">
    <div v-if="alert" @click="close" class="backdrop"></div>
    <transition name='dialog'>
      <dialog open v-if="alert">
        <header>
          <slot name="header">
            <h2>{{ title }}</h2>
          </slot>
        </header>
        <section>
          <slot></slot>
        </section>
        <menu v-if="!fixed">
          <slot name="actions">
            <button-template @click="done">{{buttonLabel}}</button-template>
          </slot>
        </menu>
      </dialog>
    </transition>
  </teleport>
</template>

<script>
import ButtonTemplate from "@/views/ButtonTemplate.vue";

export default {
  components: {ButtonTemplate},
  props: {
    alert: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    fixed: {
      type: Boolean,
      required: false,
      default: false,
    },
    buttonLabel: {
      type: String,
      required: true,
      default: 'Close'
    }
  },
  emits: ['done', 'close'],
  methods: {
    close() {
      this.$emit('close');
    },
    done() {
      if (this.fixed) {
        return;
      }
      this.$emit('done');


    },
  },
};
</script>

<style scoped lang="scss">
@import "../assets/global";
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 30000;
}

dialog {
  position: fixed;
  top: 20vh;
  left: 10%;
  width: 80%;
  z-index: 50000;
  border-radius: 12px;
  border: none;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.25);
  padding: 0;
  margin: 0;
  overflow: hidden;
  background-color: $white-rock;
}

header {
  background-color: $yellow-sea;
  color: $color-grey-dark-3;
  width: 100%;
  padding: 1rem;
  text-align: center;
}

header h2 {
  margin: 0;
}

section {
  padding: 1rem;
}

menu {
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  margin: 0;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.dialog-enter-active {
  transition: all 0.3s ease-out;
}
.dialog-leave-active {
  transition: all 0.3s ease-in;
}

.dialog-enter-to,
.dialog-leave-from {
  opacity: 1;
  transform: scale(1);
}

@media (min-width: 768px) {
  dialog {
    left: calc(50% - 20rem);
    width: 40rem;
  }
}
</style>