<template>
  <div>
  <h1>Current Top 10 Books</h1>
  <div class="top-books-list" v-if="store.topBooks && store.topBooks.length > 0">
    <div class="list-item" v-for="book in store.topBooks" :key="book.id" @click="goToDetail(book.id)">
      <TopCard  :book="book" >
      </TopCard>
    </div>
    <load-spinner v-if="isLoading"></load-spinner>
  </div>
  </div>


</template>

<script setup lang="ts">
import {bookStore} from "@/stores/books";
import router from "@/router";
import { onMounted, ref } from "vue";
import LoadSpinner from "@/views/LoadSpinner.vue";
import TopCard from "@/views/TopCard.vue";

const store = bookStore();
const isLoading = ref(false);
onMounted(async() => {
    isLoading.value = true;
    await store.loadBooks();
    isLoading.value = false;

});

function goToDetail(id:string) {
  router.replace('/books/' +id);
}

</script>

<style lang="scss" scoped>
@import "../assets/global";

h1 {
  color: $color-primary-dark;
  display: block;
  text-align: center;
}

.top-books-list {

  display: flex;
  flex-wrap: wrap;
  margin: 2rem auto;
  gap: 1rem;
  justify-content: center;

  .list-item {
    &:last-child {
      margin-bottom: 2rem;
    }
  }
}

</style>