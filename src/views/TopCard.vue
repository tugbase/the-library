<template>
  <div v-if="book.rate !== 0" class="container">
    <div class="container__book">
      <div class="container__img">
        <img :src=book.imageUrl>
      </div>
      <div class="container__content">
        <h2>{{book.title}}</h2>
        <p>
          Rate: {{book.rate}} / 10
        </p>
        <router-link :to="toLink"></router-link>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps(['book']);
const toLink = computed(() => {
  return '/books/' + props.book.id;
})
</script>

<style scoped lang="scss">
@import "../assets/global";
.container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 100px 50px;
  padding: 50px 50px;
  @media only screen and (max-width: $bp-lg) {
    padding: 25px 25px;
  }

  &__book {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 350px;
    max-width: 100%;
    height: 300px;
    background-color: white;
    border-radius: 20px;
    transition: 0.5s;
    box-shadow: 0 2rem 5rem rgba(0, 0, 0, 0.15);
    @media only screen and (max-width: $bp-lg) {
      width: 250px;
    }
  }
}
.container .container__book:hover {
  height: 260px;
  cursor: pointer;
}
.container .container__book .container__img {
  position: absolute;
  top: 20px;
  width: 300px;
  height: 220px;
  background: #333;
  border-radius: 12px;
  overflow: hidden;
  transition: 0.5s;
  @media only screen and (max-width: $bp-lg) {
    width: 270px;
  }
}

.container .container__book:hover .container__img {
  top: -100px;
  scale: 0.75;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.2);
}
.container .container__book .container__img img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.container .container__book .container__content {
  position: absolute;
  top: 252px;
  width: 100%;
  height: 35px;
  padding: 0 30px;
  text-align: center;
  overflow: hidden;
  transition: 0.5s;
}
.container .container__book:hover .container__content {
  top: 130px;
  height: 250px;
}

.container .container__book .container__content h2 {
  font-size: 1.5rem;
  font-weight: 700;
  background-image: linear-gradient(to right, $color-tertiary-light, $color-grey-dark-3);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.container .container__book .container__content p {
  color: #333;
  font-weight: 500;
  font-size: 1.5rem;


}
.container .container__book .container__content a {
  position: relative;
  top: 15px;
  display: inline-block;
  padding: 12px 25px;
  text-decoration: none;
  background: transparent;
  color: white;
  font-weight: 500;
}

.container .container__book .container__content a:hover {
  opacity: 0.8;
}

</style>
