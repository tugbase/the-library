<template>
  <form>
    <input type="search" @input="search" :value="searchTerm" placeholder="Filter items.." />
  </form>
</template>

<script>
export default {
  props: ['searchTerm'],
  emits: ['search'],
  setup(props, context) {
    function search(event) {
      context.emit('search', event.target.value);
    }
    return {search}
  }

};
</script>

<style scoped>
form {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
input {
  font: inherit;
  width: 80%;
  display: block;
  padding: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 20px;
  &:placeholder-shown {
    text-indent: 1rem;
    font-weight: lighter;
  }
}

input:focus {
  outline: none;
  border-color: #00006b;
  background-color: #eeeeff;
}
</style>