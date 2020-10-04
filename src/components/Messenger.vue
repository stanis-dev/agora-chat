<template>
  <div class="messenger">
    Messenger
    <div class="message-container">
      <p
        v-for="message in messages"
        :class="message.userId === peerID ? 'outgoing' : 'incoming'"
        class="message"
      >
        {{ message.text }}
      </p>
    </div>
    <form @submit.prevent="sendMessage">
      <input type="text" v-model="textMessageInput" />
      <button>Send</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      textMessageInput: '',
      messages: []
    };
  },
  computed: {
    RTMClient() {
      return this.$store.state.RTMClient;
    },
    peerID() {
      return this.$store.state.ongoingCall.peer;
    }
  },
  mounted() {
    this.RTMClient.on('MessageFromPeer', ({ text }, peerId) => {
      const message = { text, userId: peerId };

      this.messages.push(message);
    });
  },
  methods: {
    sendMessage() {
      const text = this.textMessageInput;
      const peerID = this.peerID;
      if (text.length <= 0) {
        return;
      }

      this.RTMClient.sendMessageToPeer({ text }, peerID)
        .then(sendResult => {
          if (sendResult.hasPeerReceived) {
            const message = { text, userId: this.$store.state.user.id };

            this.messages.push(message);
            console.log('message sent');
            this.textMessageInput = '';
          } else {
            // Server received msg, but peer didn't
            console.log('User did not receive the message');
          }
        })
        .catch(error => {
          // Send failed
          console.log('Sending message failed terribly: ' + error);
        });
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
  width: 100%;
}

input:focus {
  outline: none;
}

form button {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 2;
  align-self: flex-end;
  background-color: bisque;
  padding: 0 3px;
}
</style>
