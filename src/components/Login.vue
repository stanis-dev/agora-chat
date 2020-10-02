<template>
  <div>
    <p>Who are you?</p>
    <br />
    <form @submit.prevent="loginUser">
      <input type="text" placeholder="enter your username" v-model="user" />
      <button>Login</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: ''
    };
  },
  methods: {
    loginUser() {
      const name = this.user;
      const id = this.user;

      this.$store.dispatch('loginUser', { name, id });
    }
  }
};
</script>

<style scoped></style>
