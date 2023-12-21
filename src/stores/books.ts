import { defineStore } from "pinia";
import {userAuthStore} from "@/stores/auth";
import { useToast } from "vue-toastification";

export interface Review {
    userId: string,
    review: string,

}
export interface IsRead {
    userId: string,
    isRead: boolean
}

export interface Rate {
    userId: string,
    rate: number
}



export interface Book {
    userId: string,
    id: string,
    title: string,
    imageUrl: string,
    author: string,
    description: string,
    page: number,
    award?: string,
    review:Review[],
    rateList: Rate[],
    rate: number,
    classic: boolean,
    isRead: IsRead[]
}


export const bookStore = defineStore('book', {

    state: () =>({
        books: [] as Book[],

    }),
    getters: {
        booksList(state) {
            return state.books;
        },

        selectedBook(state) {
            return (id:string) => state.books.find(book => book.id === id)
        },
        bookReviews(state) {
            return (id:string) => state.books.find(book => book.id === id)?.review

        },

        topBooks(state) {

            return state.books.length > 10 ? state.books.sort((a,b) => b.rate - a.rate).slice(0, 10) : state.books.sort((a,b) => b.rate - a.rate) ;

        },

        userId() {
            return userAuthStore().userId;
        },
        token() {
            return userAuthStore().token;
        },
        myBooks(state) {
            return state.books.filter(book => book.userId === userAuthStore().userId);

        },

    },
    actions: {
       async addBook(book: any):Promise<boolean>{

           const bookSent: Book = {...book, userId : this.userId};
           try{
             const response =  await fetch(`https://the-library-2-default-rtdb.europe-west1.firebasedatabase.app/books.json?auth=` + this.token, {
               method: 'POST',
               body: JSON.stringify(bookSent)
             });
             useToast().success('The book has been successfully added!', {
               timeout: 2000
             });
             return true;
           } catch (error) {
             useToast().error('The book can not be added!', {
               timeout: 2000
             });
             return false;
           }
        },

        async loadBooks(): Promise<boolean> {
         try {
           const response = await fetch(`https://the-library-2-default-rtdb.europe-west1.firebasedatabase.app/books.json`);
           const booksData = await response.json();
           this.books = [];
           for(const key in booksData){
             const book = {
               userId: booksData[key].userId,
               id: key,
               title: booksData[key].title,
               imageUrl: booksData[key].imageUrl,
               author: booksData[key].author,
               description: booksData[key].description,
               page: booksData[key].page,
               award: booksData[key].award,
               review: booksData[key].review,
               rate: booksData[key].rate,
               rateList: booksData[key].rateList,
               classic: booksData[key].classic,
               isRead: booksData[key].isRead,

             };
             this.books.push(book);
           }
           return true;
         }catch (err) {
           useToast().error('The books can not be fetched!', {
             timeout: 2000
           });
           return false;
         }

        },

        async editBook(data: any): Promise<boolean> {
           const id = data.id;
           const editedBook = {...data};
           try {
             const updateRequest = await fetch(`https://the-library-2-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json?auth=`+this.token, {
               method: 'PATCH',
               body: JSON.stringify(editedBook)
             });
             const updatedBook = await updateRequest.json();
             useToast().success('The book has been successfully updated!', {
               timeout: 2000
             });
             return true;
           }catch (err) {
             useToast().error('The book can not be updated!', {
               timeout: 2000
             });
             return false;
           }


        },
        async deleteBook(data:Book): Promise<boolean> {
           const id = data.id;
          try {
            const deleteRequest = await fetch(`https://the-library-2-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json?auth=`+this.token, {
              method: 'DELETE',
              body: JSON.stringify(data)
            });
            useToast().success('The book has been successfully deleted!', {
              timeout: 2000
            });
            return true;
          } catch (err) {
            useToast().error('The book can not be deleted!', {
              timeout: 2000
            });
            return false;
          }


        }
    }
})