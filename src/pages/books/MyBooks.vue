<template>
<div>
  <div v-if="store.myBooks && store.myBooks.length !== 0">
<book-list-item v-for="book in store.myBooks" :key="book.id" :book-item="book" :is-authenticated="auth.isAuthenticated" :user-id="auth.userId" @bookRate="editRate">
  <load-spinner v-if="isLoading"></load-spinner>
</book-list-item>
  </div>
  <div v-else>You have not added any books yet !</div>
</div>
</template>
<script setup lang="ts">
import BookListItem from "@/components/BookListItem.vue";
import {bookStore} from "@/stores/books";
import {onMounted, ref} from "vue";
import LoadSpinner from "@/views/LoadSpinner.vue";
import {userAuthStore} from "@/stores/auth";

const store = bookStore();
const auth = userAuthStore();
const isLoading = ref(false);

onMounted(async() => {
    isLoading.value = true;
    await store.loadBooks();
    isLoading.value = false;
});
async function editRate(book:any) {
  await store.editBook(book);
  await store.loadBooks();
}


</script>