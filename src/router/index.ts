import { createRouter, createWebHistory } from 'vue-router'
import MainPage from "@/pages/MainPage.vue";
import {userAuthStore} from "@/stores/auth";
import NotFound from "@/pages/NotFound.vue";


const index = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainPage,
    },

    {
      path: '/auth',
      name: 'auth',
      component: () => import('../pages/auth/UserRegistration.vue'),
      meta: {requiresUnAuth: true}
    },
    {
      path: '/add-book',
      name: 'add-book',
      component: () => import('../pages/auth/AddBook.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/books',
      name: 'books',
      component: () => import('../pages/books/BookList.vue'),

    },
    {path:'/my-books', component: () => import('@/pages/books/MyBooks.vue'), meta: {requiresAuth: true}},
    {path:'/my-reviews', component: () => import('@/pages/reviews/MyReviews.vue'), meta: {requiresAuth: true}},
    {
      path: '/books/:id', component: () => import('@/pages/books/BookDetail.vue'), props: true,
      children: [
        { path: 'review', component: () => import('@/pages/reviews/BookReviews.vue') },
        {path: 'add-review', component: () => import('@/pages/reviews/AddReview.vue'),
        meta: {requiresAuth: true}
        }
      ]
    },
    {path: '/:notFound(.*)*', component: NotFound}
  ],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, behavior: 'smooth' }
  }
});
index.beforeEach(function(to, from, next) {
  const auth = userAuthStore();
  const isLoggedIn = auth.isAuthenticated;
  if(to.meta.requiresAuth && !isLoggedIn){
    next('/auth');
  } else if(to.meta.requiresUnAuth && isLoggedIn) {
    next('/');
  } else {
    next();
  }
});

export default index;
