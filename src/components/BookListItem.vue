<template>
  <div class='book-item'>
    <div class="title">
      <h3>{{book.title}}</h3>
    </div>
    <div class="main-desc">
      <div class="main-desc__image">
        <img :src="book.imageUrl" :alt="book.title">
      </div>
      <div class="main-desc__text-area">
        <span>{{book.author}}</span>
      </div>
      <div class="main-desc__rate">
        <span v-if="book.rate && book.rate > 0">{{book.rate}} / 10</span>
        <span v-else>This book has not been rated yet!</span>
      </div>
      <div v-if="isAuthenticated" class="main-desc__isRead">
        <span v-if="isUserRead">Read already!</span>
        <span v-else>Not read yet!</span>

      </div>
      <div class="button-area">
        <button-template class="detail-button" link :to="viewDetailLink">View details</button-template>
        <div v-if="isUserRead && isAuthenticated" class="rate-drowpdown">
          <label for="rate">Please rate the book!</label>
          <div class="rate-area">
          <select id='rate' name="rate" v-model="rateValue">
            <option value="0" selected>--Point--</option>
            <option v-for="point in pointArray" :key="point">{{ point }}</option>
          </select>
          <button class="rate-button" @click="sendRate()">Send Rate!</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import ButtonTemplate from "@/views/ButtonTemplate.vue";
import {computed, ref} from "vue";
import {useRouter} from "vue-router";


export default {
  components: {ButtonTemplate},
  props: ['bookItem', 'isAuthenticated', 'userId'],
  emits: ['bookRate'],
  setup(props,ctx) {
    const book = props.bookItem;
    const router = useRouter();
    const pointArray = ref([]);
    for (let i = 1; i <= 10; i++) {
      pointArray.value.push(i);
    }
    const viewDetailLink = computed( () => {
      return '/books/' + book.id;
    });
    const rate = computed(() => {
      return props.bookItem.rateList?.find(rate=> rate.userId === props.userId)?.rate
    });
    const rateValue = ref(0);
    rateValue.value = +rate.value;
    const isUserRead = props.bookItem.isRead.find(_=> _.userId === props.userId)?.isRead;
    function sendRate() {
      if(props.isAuthenticated) {
        if(book.rateList?.find(r=> r.userId === props.userId )) {
          book.rateList.find(r => r.userId === props.userId).rate = +rateValue.value;
        } else {
          book.rateList.push({rate: rateValue.value, userId: props.userId});
        }
        book.rate = book.rateList?.length > 0 ? book.rateList.reduce((accumulator, currentValue) => {
          return accumulator + +currentValue.rate
        },0) / book.rateList?.length : 0;
        book.rate = +book.rate.toFixed(1);
        ctx.emit('bookRate', book);
      } else {
        router.replace('/auth');
      }
    }

    return {book, viewDetailLink, rateValue, pointArray, sendRate, isUserRead}
  }
}
</script>

<style scoped lang="scss">
@import "../assets/global";
@import "../assets/forms";
.book-item {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 0.5rem;
  margin: 1rem auto;
  max-width: 70vw;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  @media only screen and (max-width: $bp-hg){
    max-width: 100%;
    margin-right: 1rem;
    margin-left: 1rem;
  }
}
h3 {
  font-size: 1.5rem;
  color: $color-grey-dark-3;
  @media only screen and (max-width: $bp-md) {
    font-size: 1rem;
  }

}
.main-desc {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 2rem;
  padding: 1rem;
  @media only screen and (max-width: $bp-lg){
    gap: 2rem;
  }
  &__image {
    width: 15%;
    display: flex;
    justify-content: center;

    @media only screen and (max-width: $bp-md) {
      display: none;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

  }
  &__text-area,
  &__rate,
  &__isRead{
    align-self: center;
    font-size: 1.2rem;
    color: $color-grey-dark;
    @media only screen and (max-width: $bp-lg){
    font-size: 1rem;
    }


  }
  &__isRead,
  &__rate {
    padding: 0.5rem;
    @media only screen and (max-width: $bp-md) {
      display: none;
    }
  }

}
.button-area {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-left: auto;


  @media only screen and (max-width: $bp-lg){
    justify-content: space-between;
    padding: 0.5rem;
  }

}

.rate-drowpdown {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  @media only screen and (max-width: $bp-md){
    display: none;
  }


}
.rate-area {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  @media only screen and (max-width: $bp-lg){
    flex-direction: column;
    justify-content: flex-start;
    align-self: stretch;
  }
}
.rate-button {
  border: none;
  border-radius: 50px;
  padding: 1rem;
  font-family: $font-display;
  font-weight: 600;
  color: $cadmium-green;
  background-color: $white-rock;
  cursor: pointer;
}




</style>