<template>
<div v-for="review in store.bookReviews(id)" :key="review.review">
  <div class='review' v-if="review.review !== ''" >

    <div  class="main-desc">

      <p>{{review.review}}</p>

    </div>

  </div>
</div>

</template>
<script setup lang="ts">

import {bookStore} from "@/stores/books";
import {useRoute} from "vue-router";
import { onMounted } from "vue";

const store = bookStore();
const route = useRoute();
onMounted(async()=> {
  await store.loadBooks();
})
const id = route.params.id as string;


</script>

<style scoped lang="scss">
.review {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 1rem;
  width: 90%;
  margin: 1rem auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}


.main-desc {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;


}




</style>