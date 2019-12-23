<template>
  <div id="app">
    <Header />
    <AddTodo v-on:add-todo="addTodo" />
    <Todos v-bind:todos="todos" v-on:del-todo="deleteTodo" />
  </div>
</template>

<script>
import Todos from "./components/Todos.vue";
import Header from "./components/Header.vue";
import AddTodo from "./components/AddTodo.vue";
import { db } from "./config.js";
import uuid from "uuid";

export default {
  name: "app",
  components: {
    Todos,
    Header,
    AddTodo
  },
  data() {
    return {
      demo: "demo",
      todos: [],
      db: null,
      request: null,
      isOnline: true
    };
  },
  methods: {
    deleteTodo(id) {
      if (window.navigator.onLine) {
        console.log(id);
        db.collection("todos")
          .doc(id)
          .delete()
          .then(() => {
            db.collection("todos")
              .orderBy("createdAt", "asc")
              .get()
              .then(snapshot => {
                console.log(this);
                this.todos = [];
                snapshot.docs.forEach(doc => {
                  this.todos.push({ ...doc.data(), id: doc.id });
                });
              })
              .catch(err => console.log(err));

            console.log("Document successfully deleted!");
          })
          .catch(function(error) {
            console.error("Error removing document: ", error);
          });
      } else {
        console.log(id);
        const tx = this.db.transaction("todos", "readwrite");
        tx.onerror = e => console.log(e);
        tx.objectStore("todos").delete(id).onsuccess = () => {
          this.todos = [];
          this.db
            .transaction("todos", "readonly")
            .objectStore("todos")
            .openCursor().onsuccess = e => {
            const cursor = e.target.result;

            if (cursor) {
              this.todos.push(cursor.value);
              cursor.continue();
            }
          };
        };
      }
    },
    addTodo(newTodo) {
      if (window.navigator.onLine) {
        const { title, completed } = newTodo;

        db.collection("todos")
          .doc()
          .set({ title, completed, createdAt: new Date().toISOString() })
          .then(() => {
            console.log("Document successfully written!");
            db.collection("todos")
              .orderBy("createdAt", "asc")
              .get()
              .then(snapshot => {
                console.log(this);
                this.todos = [];
                snapshot.docs.forEach(doc => {
                  this.todos.push({ ...doc.data(), id: doc.id });
                });
              })
              .catch(err => console.log(err));
          })
          .catch(function(error) {
            console.error("Error writing document: ", error);
          });
      } else {
        this.db
          .transaction("todos", "readwrite")
          .objectStore("todos")
          .add({ ...newTodo, id: uuid.v4() }).onsuccess = () => {
          this.todos = [];
          this.db
            .transaction("todos", "readonly")
            .objectStore("todos")
            .openCursor().onsuccess = e => {
            const cursor = e.target.result;

            if (cursor) {
              // alert(cursor.value.title);
              this.todos.push(cursor.value);
              cursor.continue();
            }
          };
        };
      }
    }
  },
  created() {
    if (!window.navigator.onLine) {
      console.log(this.isOnline);
      const request = indexedDB.open("todosDB");

      request.onupgradeneeded = e => {
        this.db = e.target.result;
        this.db.createObjectStore("todos", { keyPath: "id" });
      };

      request.onsuccess = e => {
        this.db = e.target.result;

        this.todos = [];
        this.db
          .transaction("todos", "readonly")
          .objectStore("todos")
          .openCursor().onsuccess = e => {
          const cursor = e.target.result;

          if (cursor) {
            this.todos.push(cursor.value);
            cursor.continue();
          }
        };
      };

      request.onerror = e => {
        alert(e + "eooror is called");
      };
    } else {
      db.collection("todos")

        .orderBy("createdAt", "asc")
        .get()
        .then(snapshot => {
          this.todos = [];
          snapshot.docs.forEach(doc => {
            this.todos.push({ ...doc.data(), id: doc.id });
          });
        });
      console.log(this.todos);
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.4;
}
.btn {
  display: inline-block;
  border: none;
  background: #555;
  color: #fff;
  padding: 7px 20px;
  cursor: pointer;
}
.btn:hover {
  background: #666;
}
</style>
