<template>
<div>

  <load-spinner v-if="isLoading"></load-spinner>
  <div v-for="book in reviewedBooks" :key="book.id" class="review-block">
    <div class="review-block__image">
      <img :src="book.imageUrl" :alt="book.title">
    </div>

    <div class="review-block__main-area">
      <router-link :to="/books/+book.id" class="review-block__title">{{book.title}}</router-link>
      <div  class="review-block__review">{{getRev(book)}}</div>
    </div>
  </div>
  <div v-if="reviewedBooks.length === 0">You have not reviewed any books yet!</div>
</div>
</template>
<script setup lang="ts">

import {Book, bookStore} from "@/stores/books";
import {computed, onMounted, ref} from "vue";
import LoadSpinner from "@/views/LoadSpinner.vue";
import {userAuthStore} from "@/stores/auth";

const store = bookStore();
const isLoading = ref(false);
const auth = userAuthStore();
onMounted(async() => {
    isLoading.value = true;
    await store.loadBooks();
    isLoading.value = false;

});

const reviewedBooks = computed(() => {
  let reviewedBookArray = [];
  for(let i = 0; i < store.booksList.length; i ++) {

    const review = store.booksList[i].review.find(_=> _.userId === auth.userId);
    if(review && review.review !== ''){
      reviewedBookArray.push(store.booksList[i]);
    }
  }
  return reviewedBookArray;

});


function getRev(book:Book) {
  return book.review.find(rev=> rev.userId === auth.userId)!.review;
}


</script>
<style scoped lang="scss">
@import "../../assets/global";
.review-block {
  border: 1px solid $color-grey-light-2;
  border-radius: 10px;
  box-shadow: 0 6px 8px rgba(0,0,0,0.2);
  margin: 2rem auto;
  width: 80vw;
  height: auto;
  display: flex;
  gap: 2rem;
  @media only screen and (max-width: $bp-md) {
    flex-direction: column;
    padding: 1rem;
  }
  &__image {
    flex: 30%;
    @media only screen and (max-width: $bp-md) {
      flex: unset;
      width: 100%;
    }
    img {
      width: 100%;
      display: block;
      object-fit: cover;
    }
  }
  &__main-area {
    flex: 70%;
    display: flex;
    flex-direction: column;
    gap: 2rem;

  }
  &__title {
    margin-top: 1rem;
    color: $color-grey-dark-3;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 1.2rem;
    font-weight: 500;


  }
  &__review {
    margin: 1rem;
  }
}

</style>