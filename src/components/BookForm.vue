<template>
  <form @submit.prevent="addBook">
    <alert-window button-label="OK" :alert="!!warning" :title="warning" @done="closeValidateWarning" @close="closeValidateWarning"></alert-window>
    <div class='form-control'>
      <label for='title'>Book Title</label>
      <input type='text' id='title' v-model.trim='title.val' :class="{invalid: !title.isValid}" @blur="checkValidity(title)">
      <p class="invalid-text" v-if="!title.isValid">Please enter a valid book name!</p>
    </div>
    <div class='form-control'>
      <label for='imageUrl'>Book Image Url</label>
      <input type='url' id='imageUrl' v-model.trim="imageUrl.val" :class="{invalid: !imageUrl.isValid}" @blur="checkValidity(imageUrl)">
      <p class="invalid-text" v-if="!imageUrl.isValid">Please add a valid image url!</p>
    </div>
    <div class="author-page">
    <div class='author'>
      <label for='author'>Author</label>
      <input type='text' id='author' v-model.trim="author.val" :class="{invalid: !author.isValid}" @blur="checkValidity(author)">
      <p class="invalid-text" v-if="!author.isValid">Please enter author name!</p>
    </div>
    <div class='page'>
      <label for='page'>Total Page</label>
      <input type='number' id='page' v-model.trim="page.val" :class="{invalid: !page.isValid}" @blur="checkValidity(page)">
      <p class="invalid-text" v-if="page.val === null">Please add a valid page number!</p>
    </div>
    </div>
    <div class='form-control'>
      <label for='award'>Awards (if any)</label>
      <input type='text' id='award' v-model.trim="award">
    </div>
    <div class='form-control'>
      <label for='description'>Book Description</label>
      <textarea id='review' rows="5" v-model.trim="description"></textarea>
    </div>
    <div class='form-control'>
      <label for='review'>Book Review</label>
      <textarea id='review' rows="5" v-model.trim="review"></textarea>
    </div>
    <div class='form-control'>

      <div class='form-control' >
        <div class="checkbox-area">
          <input type='checkbox' value='true' id='classic' v-model='classic'>
          <label for='classic'>Please check if it is a classic book!</label>
        </div>
      </div>
      <div class='form-control' >
        <div class="checkbox-area">
          <input type='checkbox' value='false' id='isRead' v-model='isRead'>
          <label for='isRead'>Please check if you have already read this book!</label>
        </div>
      </div>
      <div class="form-control">
      <div v-if="isRead" class="rate-drowpdown">

        <select id='rateValue' name="rateValue" v-model="rateValue">
          <option value="0" selected> --Point--</option>
          <option v-for="point in pointArray" :key="point" :value="point">{{ point }}</option>
        </select>
        <label for="rateValue">Please rate the book!</label>
      </div>
      </div>
    </div>

    <button-template class="submit" @submit="addBook">Add Book</button-template>
  </form>
</template>
<script>
import {ref} from "vue";
import ButtonTemplate from "@/views/ButtonTemplate.vue";

import {userAuthStore} from "@/stores/auth";

export default {
  components: {ButtonTemplate},
  emits: ['add-book'],
  setup(_, ctx) {
    const auth = userAuthStore();

    const title = ref({val: '', isValid: true});
    const imageUrl = ref({val: '', isValid: true});
    const author = ref({val: '', isValid: true});
    const page = ref({val: null, isValid: true});
    const award = ref('');
    const review = ref('');
    const description = ref('');
    const rateValue = ref(0);
    const classic = ref(false);
    const isRead = ref(false);
    const pointArray = ref([]);
    for (let i = 1; i <= 10; i++) {
      pointArray.value.push(i);
    }
    const formValid = ref(true);
    const warning = ref('');
    function validationForm() {
      if(title.value.val === '') {
        formValid.value = false;
        title.value.isValid = false;
      }
      if(imageUrl.value.val === '') {
        formValid.value = false;
        imageUrl.value.isValid = false;
      }
      if(author.value.val === '') {
        formValid.value = false;
        author.value.isValid = false;
      }
      if(page.value.val === 0 || null) {
        formValid.value = false;
        page.value.isValid = false;
      }
    }

    function addBook() {
    validationForm();
    if(formValid.value) {
      const newBook = {
        title: title.value.val,
        imageUrl: imageUrl.value.val,
        author: author.value.val,
        page: page.value.val,
        award: award.value,
        review: [{review: review.value, userId: auth.userId}],
        description: description.value,
        rateList : +rateValue.value > 0 ? [{rate: +rateValue.value, userId: auth.userId}] : [],
        rate : +rateValue.value,
        classic: classic.value,
        isRead: [{isRead: isRead.value, userId: auth.userId}]
      };
      ctx.emit('add-book', newBook);
    } else {
      warning.value = 'Please fill the required fields';
    }

    }

    function closeValidateWarning() {
      warning.value = ''
    }
    function checkValidity(input) {
      input.isValid = !(input.val === '' || input.val === 0 || input.val === null);

    }



    return {title, imageUrl, author, page, award, review, pointArray, rateValue, classic, isRead, description, addBook, warning,
    closeValidateWarning, checkValidity}

  }
}
</script>

<style scoped lang="scss">
@import "../assets/global";
form {
  margin: 3rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  background-color: $white-rock;
  align-items: center;
  border-radius: 20px;

}
.form-control {
  margin: 1rem;
  width: 75%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  @media only screen and (max-width: $bp-md) {
    width: 100%;
  }
}

.author-page {
  display: flex;
  justify-content: space-between;
  width: 75%;
  gap: 2rem;
  @media only screen and (max-width: $bp-md) {
    width: 100%;
    flex-direction: column;
    gap: 1rem;
  }
}
.author {
  margin-right: auto;
  width: 100%;
}
.page {
  width: 30%;
  @media only screen and (max-width: $bp-md) {
    width: 100%;
  }
  input {
    padding: 0.75rem;
  }
}

label {
  font-weight: bold;
  color: $color-grey-dark;
  margin-bottom: 0.5rem;
}

input[type='checkbox'] + label {
  margin: 0 0 0 2rem;
}

input,
textarea {
  font-size: 1rem;
  font-family: $font-display;
  width: 100%;
  border: none;
  border-radius: 5px;
  color: $color-grey-dark;
  padding: 0.75rem;
  transition: all 0.2s;
}

input:focus,
textarea:focus {
  box-shadow: 0 1rem 2rem rgba(0,0,0,0.1);
  outline: none;
  border-bottom: 3px solid $cadmium-green;
  transition: all 0.2s;

}
.invalid {
  border-bottom: 3px solid #ff7730;
}
input:focus + p {
  display: none;
}



input[type='checkbox'] {
  display: inline;
  width: auto;
  border: none;
}

input[type='checkbox']:checked {

  accent-color: #ff7730;

}
#classic,
#isRead{
  transform: scale(2);
}
.checkbox-area {
  margin: 0.5rem 1rem;
}



h3 {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.invalid label {
  color: red;
}

.invalid input,
.invalid textarea {
  border: 1px solid red;
}
.submit {
  align-self: end;
  margin-right: 12%;
  @media only screen and (max-width: $bp-lg) {
    width: 100%;
    margin: unset;
  }

}
.rate-drowpdown {
  display: flex;
  gap: 1rem;
  align-items: center;


  label {
    margin-bottom: unset;
  }
}
select {
  padding: 0.3rem 1rem;
  background-color: $color-grey-light-1;
  border: 1px solid $color-grey-dark-2;
  border-radius: 50px;
  font-size: 1rem;
  text-align: center;
  color: $color-grey-dark;
  font-family: $font-display;
  outline-color: $cadmium-green;
  @media only screen and (max-width: $bp-md) {
   padding: 0.3rem 0.5rem;
  }
}
option {
  outline-color: purple;
}
.checkbox-area {
  display: flex;
}
.invalid-text {
  color: #ff7730;
  margin-top: 0.5rem;
  font-style: italic;
  font-weight: 500;
}



</style>