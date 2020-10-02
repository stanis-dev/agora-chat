<template>
  <div id="app">
    <Login v-if="!user.name" />
    <Chat v-else />
  </div>
</template>

<script>
import Login from './components/Login';
import Chat from './components/Chat';

export default {
  name: 'App',
  components: {
    Login,
    Chat
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding-top: 100px;
}
</style>
