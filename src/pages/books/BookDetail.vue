<template>
  <div>
  <add-review title="Add Your Review" :show="openReview"
  @close="openCloseAddReview" @review="addReview"
  ></add-review>
  <edit-book :id="props.id" :show="openEdit" :userId="auth.userId" @close="openCloseEditTab" @edit-book="editBook" @delete-book="deleteBook"></edit-book>
  <load-spinner v-if="isLoading"></load-spinner>
  <div class="detail-block" v-if="store.selectedBook(id)">
    <div class="detail-block__top">
    <div class="detail-block__top__image">
      <img :src="store.selectedBook(id)!.imageUrl" :alt="store.selectedBook(id)!.title">
    </div>
    <div class="detail-block__top__text">
      <div class="detail-block__top__text__title">
        <span>{{store.selectedBook(id)!.title}}</span>
      </div>
      <div class="detail-block__top__text__desc">
        <span>{{ store.selectedBook(id)!.description }}</span>
        <span>Page Number : {{store.selectedBook(id)!.page}}</span>
        <span v-if="store.selectedBook(id)!.award">Awards: {{store.selectedBook(id)!.award}}</span>
      </div>
      <div class="detail-block__top__text__props">
        <div class="detail-block__text__props__item">
          <span v-if="store.selectedBook(id)!.rate">The Rate: {{ store.selectedBook(id)!.rate }} / 10</span>
          <span v-else>The book has not been rated yet!</span>
        </div>
        <div class="detail-block__top__text__props__item">
          <span v-if="isRead.isRead">You have already read this book!</span>
          <span v-if="isRead.isRead"></span>
        </div>
        <div class="detail-block__top__text__props__item">
          <span v-if="store.selectedBook(id)!.classic">This book is a classic!</span>
        </div>
      </div>
    </div>
    </div>
    <div class="detail-block__buttons">
      <button-template @click="openCloseEditTab" class="edit-tap">Edit</button-template>
      <button-template @click="openCloseAddReview" v-if="isRead.isRead">Add Review</button-template>
      <button-template @click="viewReviewsToggle">{{viewReviewsLabel}}</button-template>
    </div>
  </div>

  <router-view></router-view>
  </div>
</template>
<script lang="ts">
import ButtonTemplate from "@/views/ButtonTemplate.vue";
import {bookStore} from "@/stores/books";
import {computed, onMounted, ref} from "vue";
import AddReview from "@/pages/reviews/AddReview.vue";
import EditBook from "@/pages/books/EditBook.vue";
import {useRouter} from "vue-router";
import {userAuthStore} from "@/stores/auth";
import LoadSpinner from "@/views/LoadSpinner.vue";



export default {
  components: { LoadSpinner, AddReview, ButtonTemplate, EditBook},
  props: ['id'],
  setup(props) {
    const store = bookStore();
    const isLoading = ref(false);
    const router = useRouter();
    onMounted(async() => {
      const success = await store.loadBooks();
      store.selectedBook(props.id);
      if(!success) {
        router.replace('/');
      }
    });
    const auth = userAuthStore();
    const userIsRead = computed(() => {
        return store.selectedBook(props.id)!.isRead.find(_ => _.userId === auth.userId);
    });
    const isRead = computed(() => {
      return userIsRead.value ? userIsRead.value : {userId: auth.userId, isRead: false}
    });


    const viewReviews = ref(false);

    function viewReviewsToggle() {
      viewReviews.value = !viewReviews.value;
      if(viewReviews.value) {
        router.push(props.id + '/review');
      } else {
        router.back();
      }
    }

    const viewReviewsLabel = computed(() => {
      if(!viewReviews.value) {
        return 'Show Reviews';
      } else {
        return 'Hide Reviews';
      }
    })
    const openReview = ref(false);
    const openEdit = ref(false);
    function openCloseAddReview() {
      if(auth.isAuthenticated) {
        openReview.value = !openReview.value;
      } else {
        router.replace('/auth');
      }


    }
    function openCloseEditTab() {
      if(auth.isAuthenticated) {
        openEdit.value = !openEdit.value
      } else {
        router.replace('/auth');
      }

    }

    async function addReview(review: string) {
      if(auth.isAuthenticated) {
        isLoading.value=true;
        const book = store.selectedBook(props.id);
        const currRev = store.selectedBook(props.id)!.review.find(rev=> rev.userId === auth.userId);
        if(currRev) {
          book!.review.find(rev=> rev.userId === auth.userId)!.review = review;
          await store.editBook(book);
        } else {
          book!.review.push({ review: review, userId: auth.userId});
          await store.editBook(book);
        }
        openReview.value = false;
        isLoading.value = false;
      } else {
        router.replace('/auth');
      }


    }

    async function editBook(book: any) {
      if(auth.isAuthenticated) {
        isLoading.value=true;
        await store.editBook(book);
        await store.loadBooks();
        openEdit.value = false;
        isLoading.value = false;

      } else {
        router.replace('/auth');
      }

    }
    async function deleteBook(book: any) {
      if(auth.isAuthenticated) {
        isLoading.value=true;
        const deleteBook = await store.deleteBook(book);
        openEdit.value = false;
        isLoading.value = false;
        if(deleteBook) {
          router.replace('/books');
        }
      } else {
        router.replace('/auth');
      }


    }




    return {store,
      openCloseAddReview,
      openReview,
      addReview,
      viewReviewsToggle,
      viewReviewsLabel,
      props,
      openEdit,
      auth,
      isLoading,
      isRead,
      openCloseEditTab,
      editBook,
      deleteBook,
    };
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/global";

.detail-block {
  display: flex;
  width: 90%;
  padding: 1rem;
  margin: 2rem auto;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  @media only screen and (max-width: $bp-hg){
    width:unset;
  }


  &__top {
    width: 100%;
    display: flex;
    padding: 1rem;
    justify-content: space-between;
    border: 1px solid $cadmium-green;
    border-radius: 20px;
    box-shadow: 2rem 2rem 2rem rgba(0,0,0, 0.26);
    margin-bottom: 1rem;
    gap: 1rem;
    @media only screen and (max-width: $bp-hg){
      width: 100%;
      box-shadow: none;
    }
    @media only screen and (max-width: $bp-md) {
      flex-direction: column;
    }
    &__image {
      display: flex;
      max-width: 400px;
      justify-content: center;
      padding: 0.5rem;
      @media only screen and (max-width: $bp-lg){
        height: 200px;
      }
      @media only screen and (max-width: $bp-md){
        width: 100%;
        height: auto;
      }
      img {
        width: 100%;
        display: block;
        object-fit: cover;
      }
  }
    &__text {
      flex: 70%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 2rem;
      padding: 0.5rem;
      @media only screen and (max-width: $bp-hg){

      }

      &__desc{
        display: flex;
        flex-direction: column;
        gap: 4rem;
      }
      &__title {
        display: flex;
        font-size: $h4-font-size;
        font-weight: bold;
        color: $color-primary-dark-2;
      }

      &__props {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding-top: 0.5rem;
      }
    }

  }
  &__buttons {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 3rem;
  }
}
.edit-tap {
  @media only screen and (max-width: $bp-md) {
    display: none;
  }
}
</style>