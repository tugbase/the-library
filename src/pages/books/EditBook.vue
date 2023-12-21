<template>

  <teleport to="body">
    <AlertWindow
                  button-label="Delete"
                  :alert="alertWindow"
                  title="Are you sure you want to delete this book ?"
                  @done="deleteBook"
                  @close="closeAlert">
    </AlertWindow>
    <div v-if="show" @click="close" class="backdrop"></div>
    <transition name='edit'>
      <dialog open v-if="show" class="edit">
        <header>
          <slot name="header">
            <h2>Edit Book</h2>
          </slot>
        </header>
        <form @submit.prevent="editBook" class="edit-form">
          <div class="text-input-area">
          <div class='form-control'>
            <label for='title'>Book Title</label>
            <input type='text' id='title' v-model.trim='book.title'>
          </div>
          <div class='form-control'>
            <label for='author'>Author</label>
            <input type='text' id='author' v-model.trim="book.author">
          </div>
          </div>

          <div class="text-input-area">
          <div class='form-control'>
            <label for='imageUrl'>Book Image Url</label>
            <input type='url' id='imageUrl' v-model.trim="book.imageUrl">
          </div>
          <div class='form-control'>
            <label for='award'>Awards (if any)</label>
            <input type='text' id='award' v-model.trim="book.award">
          </div>
          </div>
          <div class="text-input-area main-text">
            <div class='form-control'>
              <label for='description'>Book Description</label>
              <textarea id='review' rows="5" v-model.trim="book.description"></textarea>
            </div>
            <div v-if="isRead.isRead" class="form-control">
            <label for='review'>Book Review</label>
            <textarea id='review' rows="5"  v-model.trim="myReview.review"></textarea>
            </div>
          </div>
        <div class="page-edit-area">
          <div class='form-control'>
            <label for='page'>Total Page</label>
            <input type='number' id='page' v-model.trim="book.page">
          </div>
        </div>


          <div class='check-input-area'>

            <div class='form-control' >
              <div class="checkbox-area">
                <input type='checkbox' value='true' id='classic' v-model='book.classic'>
                <label for='classic'>Please check if it is a classic book!</label>
              </div>
            </div>
            <div class='form-control' >
              <div class="checkbox-area">
                <input type='checkbox'  id='isRead' v-model='isRead.isRead'>
                <label for='isRead'>Please check if you have already read this book!</label>
              </div>
            </div>
            <div v-if="isRead.isRead" class="rate-drowpdown">
              <label for="rate">Please rate the book!</label>
              <select id='rate' name="rate" v-model="rate.rate">
                <option value="0" selected> --Point--</option>
                <option v-for="point in pointArray" :key="point">{{ point }}</option>
              </select>
            </div>
          </div>
          <button-template class="submit" @submit="editBook">Edit Book</button-template>
        </form>
        <menu>
          <slot name="actions">
            <button-template @click="openAlert" class="delete">Delete Book</button-template>
            <button-template @click="close" class="close">Close</button-template>

          </slot>
        </menu>
      </dialog>
    </transition>
  </teleport>
</template>
<script setup>
import ButtonTemplate from "@/views/ButtonTemplate.vue";
import {bookStore} from "@/stores/books";
import { computed, onMounted, ref } from "vue";
import AlertWindow from "@/components/AlertWindow.vue";

const store = bookStore();
const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },

  id: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }

});
const emits = defineEmits(['close', 'editBook', 'deleteBook']);

onMounted(async() => {
  await store.loadBooks();

});

const book = computed(() => {
  return store.selectedBook(props.id);

});

const currReview = computed(() => {
  return  store.selectedBook(props.id).review.find(review => review.userId === props.userId);
});

const myReview = computed(() => {
  return currReview.value ? currReview.value : {userId: props.userId, review: ''}
});

const userIsRead = computed(() => {
  return store.selectedBook(props.id).isRead.find(_ => _.userId === props.userId);
});

const isRead = computed(() => {
  return  userIsRead.value ? userIsRead.value : ref({userId: props.userId, isRead: false}).value;
});

const userRate = computed(() => {
  return store.selectedBook(props.id).rateList?.find(_=> _.userId === props.userId);
});

const rate = computed(() => {
  return userRate.value ? userRate.value : {userId: props.userId, rate: 1}
});

const pointArray = ref([]);
for (let i = 1; i <= 10; i++) {
  pointArray.value.push(i);
}
function close() {
  emits('close');
}
const alertWindow = ref(false);

function editBook() {
  const bookIsRead =  book.value.isRead.find(_=> _.userId === props.userId);
  bookIsRead ? bookIsRead.isRead = isRead.value.isRead : book.value.isRead.push(isRead.value);

  const review = book.value.review.find(review => review.userId === props.userId);
  const myRate = book.value.rateList?.find(_=> _.userId === props.userId);

  if(isRead.value.isRead) {
    review ? review.review = myReview.value.review : book.value.review.push(myReview.value);
    myRate ? myRate.rate = rate.value.rate : (book.value.rateList ? book.value.rateList.push(rate.value) : book.value.rateList = [rate.value]);
  } else {
    if(review){
      review.review = '';
    }
    if(myRate) {
      const index = book.value.rateList.indexOf(myRate);
      book.value.rateList.length === 1 ? book.value.rateList = [] : book.value.rateList.splice(index, 1);
    }
  }

  const sumOfRates = book.value.rateList.reduce((accumulator, currentValue) => {
    return accumulator + +currentValue.rate;
  }, 0);
  book.value.rate = book.value.rateList.length > 0 ? sumOfRates/book.value.rateList.length : 0;
  book.value.rate = +book.value.rate.toFixed(1);
  emits('editBook', book.value);
}

function openAlert() {
  alertWindow.value=true;
}
function closeAlert() {
  alertWindow.value = false;
}
function deleteBook() {
  alertWindow.value = false;
  emits('deleteBook', book.value);
}

</script>



<style scoped lang="scss">
@import "../../assets/components.scss";
@import "../../assets/forms.scss";


.edit {
  top: 5px;
  width: 70vw;
  height: auto;
  left: 10%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 10000;
  @media only screen and (max-width: $bp-hg) {
    top: 10%
  }
  @media only screen and (max-width: $bp-lg) {
    top: 0;
  }

}
.edit-form {
  padding: 0;
  margin-bottom: 0;
  margin-top: 1rem;
  @media only screen and (max-width: $bp-lg) {
    margin: 1rem;
  }
}

.text-input-area {
  display: flex;
  width: 100%;
}
.check-input-area {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.page-edit-area {
  align-self: flex-start;
}
.submit {
  margin-right: unset;
}
.close {
  margin-right: 3rem;
  @media only screen and (max-width: $bp-lg) {
    margin-right: 0;
  }
}


.edit-enter-from,
.edit-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.edit-enter-active {
  transition: all 0.3s ease-out;
}
.edit-leave-active {
  transition: all 0.3s ease-in;
}

.edit-enter-to,
.edit-leave-from {
  opacity: 1;
  transform: scale(1);
}

.delete {
  margin-right: auto;
  background-color: orangered;
}
.main-text {
  @media only screen and (max-width: $bp-hg) {
    display: flex;
    flex-direction: column;
  }
  .form-control {
    @media only screen and (max-width: $bp-hg) {
      width: 96%;
    }
  }
}
.alert {
  position: absolute;
  z-index: 300;
}
.form-control {
  @media only screen and (max-width: $bp-lg) {
    margin-top: 0;
  }
}
@media (max-width: $bp-hg) {
  dialog {
    left: 5%;
    width: 90%
  }
}


</style>