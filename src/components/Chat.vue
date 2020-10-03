<template>
  <div>
    <button
      class="bg-red-300 p-2 rounded hover:bg-red-400 mb-3 w-40"
      @click="logout"
    >
      Logout
    </button>
    <p>
      User <strong>{{ user.name }}</strong> is Logged-in!
      <br />
      Connection to Agora.io:
      <span
        :class="
          connectionStatus === 'CONNECTED' ? 'text-green-600' : 'text-red-500'
        "
        >{{ connectionStatus }}</span
      >
      <br />
      <Search v-if="channel" :channel="channel" :client="client" />
      <br />
      <Call
        v-if="
          $store.state.inCall.remoteInvitation ||
            $store.state.outCall.localInvitation
        "
      />
    </p>
  </div>
</template>

<script>
import Search from './Search';
import Call from './Call';

import AgoraRTM from 'agora-rtm-sdk';

export default {
  components: {
    Search,
    Call
  },
  data() {
    return {
      isConnected: false,
      connectionStatus: '',
      channel: null
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    client() {
      return this.$store.state.RTMClient;
    },
    remoteInvitation() {
      return this.$store.state.inCall.remoteInvitation;
    }
  },
  created() {
    const client = AgoraRTM.createInstance(this.$store.state.config.appID);
    this.$store.dispatch('updateRTMClient', client);

    // A listener for connection
    this.client.on('ConnectionStateChanged', (newState, reason) => {
      console.log(
        'on connection state changed to ' + newState + ' reason: ' + reason
      );
      this.connectionStatus = newState;
    });

    //login
    this.client
      .login({
        token: null,
        uid: this.user.id
      })
      .then(() => {
        console.log('AgoraRTM client login success');
        this.isConnected = true;
        this.joinChannel();
      })
      .catch(err => {
        console.log('AgoraRTM client login failure', err);
        this.isConnected = false;
      });

    this.localInvitationListeners();
    this.remoteInvitationListeners();

    /* Incoming Call Listeners */
  },
  methods: {
    logout() {
      this.client.logout();

      this.$store.dispatch('logoutUser');
    },
    async joinChannel() {
      try {
        this.channel = await this.client.createChannel('Cupra');
        await this.channel.join();
      } catch (error) {
        console.log('Error joining the channel');
      }
    },
    remoteInvitationEvents() {
      //The caller has cancelled the call invitation
      this.remoteInvitation.on('RemoteInvitationCanceled', () => {
        console.log('The call invitation was cancelled');
      });

      //Accepted call invitation successfully
      this.remoteInvitation.on('RemoteInvitationAccepted', () => {
        this.$store.dispatch('setCallStatus', true);
        console.log('Peers receive calls');
      });

      //Call invitation rejected successfully
      this.remoteInvitation.on('RemoteInvitationRefused', () => {
        console.log('The call invitation has been declined');
      });

      //Call invitation process failed
      this.remoteInvitation.on('RemoteInvitationFailure', () => {
        console.log('Peer call process failed');
      });
    },
    localInvitationListeners() {
      /* Outgoing Call Listeners */
      this.client.on('LocalInvitationReceivedByPeer', () => {
        console.log('Your call has been received');
      });

      this.client.on('LocalInvitationAccepted', () => {
        console.log('Your call has been accepted!');
      });

      this.client.on('LocalInvitationRefused', () => {
        console.log('Your call has been rejected!');
      });

      this.client.on('LocalInvitationCanceled', () => {
        console.log('Your call has been canceled by you!');
      });
    },
    remoteInvitationListeners() {
      this.client.on('RemoteInvitationReceived', remoteInvitation => {
        console.log(
          'Incoming call detected: ' + JSON.stringify(remoteInvitation)
        );
        // TODO: Ask user if to accept and after 15sec cancel it anyway
        this.$store.dispatch('setRemoteInvitation', remoteInvitation);
        this.remoteInvitationEvents();
      });

      this.client.on('RemoteInvitationFailure', () => {
        console.log('Incoming call failed');
        console.log(remoteInvitation);
      });
      this.client.on('RemoteInvitationAccepted', () => {
        console.log('Incoming call accepted');
        console.log(remoteInvitation);
      });
      this.client.on('RemoteInvitationCanceled', () => {
        console.log('Incoming call rejected');
        console.log(remoteInvitation);
      });
    }
  }
};
</script>

<style scoped></style>
