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
      todos: []
    };
  },
  methods: {
    deleteTodo(id) {
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
    },
    addTodo(newTodo) {
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
    }
  },
  created() {
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
