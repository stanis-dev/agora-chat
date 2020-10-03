<template>
  <div>
    <p>Call Component</p>
    <div class="call-in">
      <button @click="acceptCall">Accept</button>
      <button>Decline</button>
    </div>
    <CallActive v-if="$store.state.call.active" />
  </div>
</template>

<script>
import CallActive from './CallActive';

export default {
  components: {
    CallActive
  },
  props: ['call'],
  computed: {
    rtcConfig() {
      return {
        token: process.env.VUE_APP_AGORA_APP_TOKEN,
        channel: ''
      };
    },
    remoteInvitation() {
      return this.$store.state.inCall.remoteInvitation;
    }
  },
  updated() {
    if (this.remoteInvitation) {
      this.remoteInvitation.on('RemoteInvitationCanceled', () => {
        console.log('The call invitation was cancelled');
      });

      //Accepted call invitation successfully
      this.remoteInvitation.on('RemoteInvitationAccepted', () => {
        console.log('Peers receive calls');
        this.$store.dispatch('updateCallStatus', true);
      });

      //Call invitation rejected successfully
      this.remoteInvitation.on('RemoteInvitationRefused', () => {
        console.log('The call invitation has been declined');
      });

      //Call invitation process failed
      this.remoteInvitation.on('RemoteInvitationFailure', () => {
        console.log('Peer call process failed');
      });
    }
  },
  methods: {
    acceptCall() {
      console.log('trying to accept');
      this.remoteInvitation.accept();
    }
  }
};
</script>

<style scoped></style>
