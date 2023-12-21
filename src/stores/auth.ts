import {defineStore} from 'pinia';
import { useToast } from "vue-toastification";


export const userAuthStore = defineStore('auth', {
  state:() => ({
    userId: '',
    token: '',
    autoLogout: false
  }),
  getters: {
    userIdGetter(state){
      return state.userId;
    },
    tokenGetter(state) {
      return state.token;
    },
    isAuthenticated(state) {
      return !!state.token;
    },
    isAutoLoggedOut(state) {
      return state.autoLogout;
    }
  },
  actions: {
    async login(loginData: any) {
      return this.auth(loginData, 'login');
    },
    async signUp(registerData: any) {
      return this.auth(registerData, 'signup');
    },
    async auth(data:any, mode: string) {

      let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBsdtO9WDQLH6Fnu23VfNZwdvj0jiFoYik';
      if(mode === 'signup') {
        url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBsdtO9WDQLH6Fnu23VfNZwdvj0jiFoYik';
      }
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          email: data.userEmail,
          password: data.password,
          returnSecureToken: true
        })
      });
      const responseData = await response.json();
      if(!response.ok) {
        useToast().error('Occurred an error trying to authenticate', {
          timeout: 2000
        });
      }  else {
        useToast().success('Successfully authenticated', {
          timeout: 2000
        });
      }
      const expiresIn = +responseData.expiresIn * 1000;
      const expirationData = new Date().getTime() + expiresIn;
      localStorage.setItem('token', responseData.idToken);
      localStorage.setItem('userId', responseData.localId);
      localStorage.setItem('expiration', expirationData + "");

      setTimeout(() => {
        this.tryAutoLogout();
      }, expiresIn)


      this.token = responseData.idToken;
      this.userId = responseData.localId;


    },
    tryLogin() {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const expiration = localStorage.getItem('expiration');

      if(token && userId) {
        this.token = token as string;
        this.userId = userId as string;
        const time = new Date().getTime();
        const difference = expiration? +expiration - time : 0;
        if(difference < 0) {
          useToast().error('Logged in time expired. You need to login again', {
            timeout:2000
          });
          return;
        }
        setTimeout(() => {
          this.tryAutoLogout();
        }, difference);
      }
    },
    logOut() {
      this.token = '';
      this.userId = '';
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('expiration');
      useToast().warning('You have logged out!', {
        timeout: 2000
      });
    },
    autoLogoutSet() {
      this.autoLogout= true;
    },
    tryAutoLogout() {
      this.logOut();
      this.autoLogoutSet();
    }
  }
})
