<template>
  <div>
  <search-area :search-term="searchTerm" @search="updateSearch"></search-area>
  <div class="search-buttons">
    <button @click="sort('asc', 'title')">Sort Ascending</button>
    <button @click="sort('desc', 'title')">Sort Descending</button>
    <button @click="sort('asc', 'rate')">Sort Ascending Ratings</button>
    <button @click="sort('desc','rate')">Sort Descending Ratings</button>
  </div>
  <book-list-item v-for="book in displayedBooks" :book-item="book" :key="book.id" @bookRate="editRate" :is-authenticated="auth.isAuthenticated"
  :user-id="auth.userId">

  </book-list-item>
  <load-spinner v-if="isLoading"></load-spinner>
  </div>
</template>

<script>
import { bookStore } from "@/stores/books";
import { userAuthStore } from "@/stores/auth";
import BookListItem from "@/components/BookListItem.vue";
import SearchArea from "@/views/SearchArea.vue";
import {computed, onMounted, ref, watch} from "vue";
import LoadSpinner from "@/views/LoadSpinner.vue";



export default {
  components: { LoadSpinner, SearchArea, BookListItem},
  setup() {
    const auth = userAuthStore();
    const bookStr = bookStore();
    const isLoading = ref(false);


    onMounted(async() => {
      await bookStr.loadBooks();
    });

    const searchTerm = ref('');
    const activeSearchTerm = ref('');
    const sorting = ref(null);

    const availableBooks = computed(()=> {
      let books = [];
      if (activeSearchTerm.value) {
        books = bookStr.booksList.filter((book) =>
            book.title.toLowerCase().includes(activeSearchTerm.value.toLowerCase())
        );
      } else if (bookStr.booksList) {
        books = bookStr.booksList;
      }
      return books;
    });


    let displayedBooks = computed(()=> {
      if (!sorting.value) {
        return availableBooks.value;
      }
      return availableBooks.value.slice().sort((b1, b2) => {
        if(b1[sorting.value.prop] > b2[sorting.value.prop]) {
          return sorting.value.mode === "asc" ? 1 : -1
        } else {
          return sorting.value.mode === "asc" ? -1 : 1
        }
      })
    });

    function updateSearch(val) {
      searchTerm.value = val;
    }

    function sort(mode, property) {

      sorting.value = {mode: mode, prop: property};
    }
    watch(searchTerm, function(newValue, oldValue){
      setTimeout(() => {
        if (newValue === searchTerm.value) {
          activeSearchTerm.value = newValue;
        }
      }, 1000);
    });
    async function editRate(book) {
      await bookStr.editBook(book);
      await bookStr.loadBooks();

    }
    return {bookStr, searchTerm, availableBooks, displayedBooks, updateSearch, sort, sorting, editRate, auth, isLoading};
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/global";
.search-buttons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-content: center;
}
button {
  height: 40px;
  width: 300px;
  font: inherit;
  border: none;
  background-color: transparent;
  color: $cadmium-green;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all 0.2s;
  &:hover {
    transform: translateY(-0.5px);
    font-weight: bold;
    border-bottom: 1px solid $color-grey-dark;
  }
  &:active {
    transform: translateY(1px);
  }

}




</style>