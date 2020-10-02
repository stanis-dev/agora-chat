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
      rawOnlineUsersList: [],
      invitation: null
    };
  },
  computed: {
    onlineUsersList() {
      return this.rawOnlineUsersList.filter(
        user => user !== this.$store.state.user.name
      );
    }
  },
  methods: {
    async getConnectedUsers() {
      this.rawOnlineUsersList = await this.$props.channel.getMembers();
    },
    async sendCallInvitation(userId) {
      try {
        this.invitation = await this.$props.client.createLocalInvitation(
          userId
        );

        this.invitation.send();
        this.$store.dispatch('setStateCallStarted', {
          state: 'Initiated',
          receiverId: userId
        });
      } catch (error) {
        console.log(error);
      }
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
