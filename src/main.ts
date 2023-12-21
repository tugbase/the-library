import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import index from './router'
import BookListItem from "@/components/BookListItem.vue";
import ButtonTemplate from "@/views/ButtonTemplate.vue";
import TheHeader from "@/views/TheHeader.vue";
import BookForm from "@/components/BookForm.vue";
import SearchArea from "@/views/SearchArea.vue";
import BookCard from "@/views/BookCard.vue";
import AlertWindow from "@/components/AlertWindow.vue";
import LoadSpinner from "@/views/LoadSpinner.vue";
import TopCard from "@/views/TopCard.vue";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";


const options = {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true,
  position: 'bottom-right',
  closeOnClick: true,
  pauseOnHover: true
};


const app = createApp(App);


app.use(createPinia());
app.use(index);
app.use(Toast, options);
app.component('button-template', ButtonTemplate);
app.component('book-list-item', BookListItem);
app.component('the-header', TheHeader);
app.component('book-form', BookForm);
app.component('search-area', SearchArea);
app.component('book-card', BookCard);
app.component('AlertWindow', AlertWindow);
app.component('load-spinner', LoadSpinner);
app.component('top-card', TopCard);

app.mount('#app');
