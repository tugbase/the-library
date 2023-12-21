<template>
  <div>
  <book-form @add-book="addBook"></book-form>
  <load-spinner v-if="isLoading"></load-spinner>
  </div>
</template>
<script lang="ts">

import BookForm from "@/components/BookForm.vue";
import { bookStore} from "@/stores/books";
import {useRouter} from "vue-router";
import {ref} from "vue";
import LoadSpinner from "@/views/LoadSpinner.vue";


export default {
  components: { LoadSpinner, BookForm},
  setup() {
const store = bookStore();
const router = useRouter();
const isLoading = ref(false);
const error = ref('');

async function addBook(book:any) {

    isLoading.value = true;
    const success = await store.addBook(book);
    isLoading.value = false;
    if(success) {
      router.replace('/books');
    }
}

return {store, addBook, isLoading, error};
  }
}


</script>