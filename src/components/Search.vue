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
  methods: {
    async getConnectedUsers() {
      this.rawOnlineUsersList = await this.$props.channel.getMembers();
    },
    async sendCallInvitation(userId) {
      //TODO: clean this
      try {
        /*  Create invitation */
        this.invitation = await this.$store.state.RTMClient.createLocalInvitation(
          userId
        );

        /* Set the listeners on the events of this invitation */
        //Local monitoring and inviting peers
        this.invitation.on('LocalInvitationReceivedByPeer', () => {
          console.log('Peers receive calls');
        });

        //Cancel call invitation
        this.invitation.on('LocalInvitationCanceled', () => {
          console.log('Cancel call invitation');
        });

        //Called accepted call invitation
        this.invitation.on('LocalInvitationAccepted', () => {
          this.$store.dispatch('setCallStatus', true);
          console.log('Peers accept invitations to call');
        });

        //Called down
        this.invitation.on('LocalInvitationRefused', () => {
          console.log('Peers refuse to call invitations');
        });

        //Local call failed
        this.invitation.on('LocalInvitationFailure', () => {
          console.log('Call process failed');
        });

        const channel = this.getRoomCode(this.$store.state.user.id, userId);
        this.invitation.content = channel;

        //Send call invitation locally
        this.invitation.send();

        /* this.$store.dispatch('setStateCallStarted', {
          state: 'Initiated',
          receiverId: userId
        }); */
        this.$store.dispatch('setLocalInvitation', this.invitation);

        this.$store.dispatch('updateConfig', { channelName: channel });
      } catch (error) {
        console.log(error);
      }
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
  margin-top: 10px;
}

li {
  cursor: pointer;
  font-size: 1.2rem;
  text-transform: uppercase;
  border-bottom: 1px solid black;
}
</style>
