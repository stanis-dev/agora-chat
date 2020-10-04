<template>
  <div class="search">
    <h3>Online users in channel: {{ channel.channelId }}</h3>
    <input type="text" v-model="userSearchInput" @input="getConnectedUsers" />
    <div class="user-list">
      <ul>
        <li
          v-for="user in onlineUsersList"
          :key="user"
          @click="sendCallInvitation(user)"
          v-show="user"
        >
          {{ user }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: ['channel', 'client'],
  data() {
    return {
      userSearchInput: '',
      rawOnlineUsersList: []
    };
  },
  computed: {
    onlineUsersList() {
      return this.rawOnlineUsersList.filter(
        user => user !== this.$store.state.user.name
      );
    },
    localInvitation() {
      return this.$store.state.outCall.localInvitation;
    }
  },
  mounted() {
    this.getConnectedUsers();
  },
  methods: {
    async getConnectedUsers() {
      if (this.userSearchInput.length <= 3) {
        this.rawOnlineUsersList = await this.$props.channel.getMembers();
      } else {
        this.rawOnlineUsersList = await this.$props.channel.getMembers();
        this.rawOnlineUsersList = this.rawOnlineUsersList.filter(user => {
          return user.includes(this.userSearchInput) && user;
        });
      }
    },
    async sendCallInvitation(calleeId) {
      //TODO: clean this
      try {
        // 1. Config the Invitation
        this.invitation = await this.$store.state.RTMClient.createLocalInvitation(
          calleeId
        );
        // Attach a roomName to joing if accepted
        const channel = this.getRoomCode(this.$store.state.user.id, calleeId);
        this.invitation.content = channel;

        this.localInvitationListeners(calleeId);

        // 2. Send the Invitation
        this.invitation.send();
        this.$store.commit('updateOutgoingCall', {
          received: true,
          receiverID: calleeId,
          localInvitation: this.invitation
        });

        this.$store.dispatch('updateConfig', { channelName: channel });
      } catch (error) {
        console.log(error);
      }
    },
    localInvitationListeners(calleeId) {
      this.invitation.on('LocalInvitationReceivedByPeer', () => {
        console.log('Peers receive calls');
      });

      //Cancel call invitation
      this.invitation.on('LocalInvitationCanceled', () => {
        console.log('Cancel call invitation');
        this.$store.commit('updateOutgoingCall', {
          received: false,
          receiverID: ''
        });
      });

      //Called accepted call invitation
      this.invitation.on('LocalInvitationAccepted', () => {
        console.log('Peers accept invitations to call');
        this.$store.commit('updateOutgoingCall', {
          received: false,
          receiverID: ''
        });
        this.$store.commit('updateOngoingCall', {
          active: true,
          peer: calleeId,
          status: 'accepted'
        });
      });

      //Called down
      this.invitation.on('LocalInvitationRefused', () => {
        console.log('Peers refuse to call invitations');
        this.$store.commit('updateOutgoingCall', {
          received: false,
          receiverID: ''
        });
      });

      //Local call failed
      this.invitation.on('LocalInvitationFailure', () => {
        this.$store.commit('updateOutgoingCall', {
          received: false,
          receiverID: ''
        });
      });
    },
    getRoomCode(callerId, calleeId) {
      return callerId + calleeId;
    }
  }
};
</script>

<style scoped>
.search {
  margin-top: 2rem;
}

input {
  border: 1px solid grey;
  border-radius: 10px;
  height: 2.5rem;
  padding: 5px 10px;
}

input:focus {
  outline: none;
}

.user-list {
  margin: 1rem auto;
  display: flex;
  justify-content: center;
}

ul {
}

li {
  cursor: pointer;
  font-size: 1.2rem;
  text-transform: uppercase;
  border-bottom: 1px solid black;
  max-width: 200px;
  text-align: center;
}
</style>
