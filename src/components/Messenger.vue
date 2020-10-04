<template>
  <div class="messenger">
    Messenger
    <div class="message-container">
      <div class="message incoming">Hello there!</div>
      <div class="message outgoing">What's up?</div>
    </div>
    <form @submit.prevent="sendMessage">
      <input type="text" />
      <button>Send</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messages: [
        { message: 'Hello there!', id: 1 },
        { message: 'Whats up?', id: 2 }
      ]
    };
  },
  methods: {
    sendMessage(message) {
      console.log('message sent');
    }
  }
};
</script>

<style scoped>
.messenger {
  background-color: lightsteelblue;
  height: 300px;
  width: 200px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid lightsteelblue;
  overflow: hidden;
  position: relative;
}

.message-container {
  background-color: lightblue;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.message {
  padding: 0.3rem 0.5rem;
}

.message.incoming {
  background-color: white;
  text-align: start;
}
.message.outgoing {
  background-color: lightseagreen;
  text-align: end;
}

input {
  padding-left: 0.5rem;
}

input:focus {
  outline: none;
}

form button {
  position: absolute;
  bottom: 0;
  z-index: 2;
  align-self: flex-end;
  background-color: bisque;
  padding: 0 3px;
}
</style>
