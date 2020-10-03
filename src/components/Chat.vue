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
      <CallControl
        v-if="
          $store.state.incomingCall.received ||
            $store.state.outgoingCall.received
        "
      />
    </p>
    <CallActive v-if="$store.state.ongoingCall.active" />
  </div>
</template>

<script>
import Search from './Search';
import CallControl from './CallControl';
import CallActive from './CallActive';

import AgoraRTM from 'agora-rtm-sdk';

export default {
  components: {
    Search,
    CallControl,
    CallActive
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

    this.client.on('RemoteInvitationReceived', remoteInvitation => {
      console.log('Incoming call detected');
      // TODO: Ask user if to accept and after 15sec cancel it anyway

      this.remoteInvitationListeners(remoteInvitation);

      this.$store.dispatch('updateConfig', {
        channelName: remoteInvitation.content,
        host: false
      });
      this.$store.commit('updateIncomingCall', {
        received: true,
        callerID: remoteInvitation.callerId,
        remoteInvitation
      });
    });

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
    remoteInvitationListeners(remoteInvitation) {
      remoteInvitation.on('RemoteInvitationFailure', () => {
        console.log('Incoming call failed');

        this.$store.dispatch('updateConfig', {
          channelName: '',
          host: true
        });
        this.$store.commit('updateIncomingCall', {
          received: false,
          callerID: '',
          remoteInvitation: null
        });
      });

      remoteInvitation.on('RemoteInvitationAccepted', () => {
        console.log('We accept the incoming invitation');
        this.$store.commit('updateIncomingCall', {
          received: false,
          callerID: '',
          remoteInvitation: null
        });

        this.$store.commit('updateOngoingCall', {
          active: true,
          peer: remoteInvitation.callerId,
          status: 'accepted'
        });
      });

      remoteInvitation.on('RemoteInvitationCanceled', () => {
        console.log('Incoming call rejected');

        this.$store.commit('updateIncomingCall', {
          received: false,
          callerID: '',
          remoteInvitation: null
        });
      });

      remoteInvitation.on('RemoteInvitationRefused', () => {
        console.log('Incoming call rejected');

        this.$store.commit('updateIncomingCall', {
          received: false,
          callerID: '',
          remoteInvitation: null
        });
      });
    }
  }
};
</script>

<style scoped></style>
