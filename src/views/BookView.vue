<template>
  <div class='bookBase'>
    <slot></slot>
  </div>
</template>

<style scoped>
.bookBase {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 6rem;
  margin: 2rem auto;
  max-width: 40rem;
  height: 10vh;
}
</style>
<script setup lang="ts">
</script>