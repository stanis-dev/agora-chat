<template>
  <div>
    <p>Call Component</p>
    <div class="call-in" v-if="$store.state.incomingCall.received">
      <button @click="acceptIncomingCall">Accept</button>
      <button @click="rejectIncomingCall">Decline</button>
    </div>
    <div class="call-out" v-if="$store.state.outgoingCall.received">
      <button @click="cancelOutgoingCall">
        Cancel
      </button>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    remoteInvitation() {
      return this.$store.state.incomingCall.remoteInvitation;
    },
    localInvitation() {
      return this.$store.state.outgoingCall.localInvitation;
    }
  },
  methods: {
    acceptIncomingCall() {
      console.log('trying to accept');
      this.remoteInvitation.accept();
    },
    cancelOutgoingCall() {
      this.localInvitation.cancel();
    },
    rejectIncomingCall() {
      this.remoteInvitation.refuse();
    }
  }
};
</script>

<style scoped></style>
