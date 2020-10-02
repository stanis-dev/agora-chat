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
      <Call v-if="$store.state.call.active" />
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
      client: '',
      connectionStatus: '',
      channel: null
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  created() {
    // Options for joining a channel
    /* const option = {
      channel: 'Cupra',
    }; */

    const options = {
      appID: 'd4e6ed0d6a8b450cb801d894e633f198',
      uid: this.user.id,
      token:
        '006a1d55dab3a3a41e3bb329792a0cc6cbfIABVJ2NctG6Yubw/VRzPHL03RQg/H9ZXf6R/tmkPsdvQH8Cn3fYAAAAAEAA8TtCoPXJ3XwEAAQA8cndf'
    };

    const client = AgoraRTM.createInstance(options.appID);
    this.client = client;

    // A listener for connection
    client.on('ConnectionStateChanged', (newState, reason) => {
      console.log(
        'on connection state changed to ' + newState + ' reason: ' + reason
      );
      this.connectionStatus = newState;
    });

    //login
    client
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

    /* Outgoing Call Listeners */
    client.on('LocalInvitationReceivedByPeer', () => {
      this.$store.dispatch('setCallStatus', 'Received, Stand by...');
    });

    client.on('LocalInvitationAccepted', () => {
      console.log('Your call has been accepted!');
    });

    client.on('LocalInvitationRefused', () => {
      console.log('Your call has been rejected!');
    });

    client.on('LocalInvitationCanceled', () => {
      console.log('Your call has been canceled by you!');
    });

    /* Incoming Call Listeners */
    client.on('RemoteInvitationReceived', remoteInvitation => {
      console.log('Incoming call detected');
      console.log(remoteInvitation);
    });

    client.on('RemoteInvitationFailure', remoteInvitation => {
      console.log('Incoming call failed');
      console.log(remoteInvitation);
    });
    client.on('RemoteInvitationAccepted', remoteInvitation => {
      console.log('Incoming call accepted');
      console.log(remoteInvitation);
    });
    client.on('RemoteInvitationCanceled', remoteInvitation => {
      console.log('Incoming call rejected');
      console.log(remoteInvitation);
    });
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
    }
  }
};
</script>

<style scoped></style>
