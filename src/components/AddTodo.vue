<template>
  <div>
    <form @submit.prevent="addTodo">
      <input type="text" name="title" v-model="title" placeholder="add todo" />
      <input type="submit" value="submit" class="btn" />
    </form>
  </div>
</template>

<script>
export default {
  name: "AddTodo",
  data() {
    return {
      title: ""
    };
  },
  methods: {
    addTodo() {
      const newTodo = {
        title: this.title,
        completed: false
      };
      this.$emit("add-todo", newTodo);
      this.title = "";
    }
  }
};
</script>

<style scoped>
form {
  display: flex;
}
input[type="text"] {
  flex: 10;
  padding: 5px;
}
input[type="submit"] {
  flex: 2;
}
</style>