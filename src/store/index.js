import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    RTMClient: null,
    user: {
      name: '',
      id: ''
    },
    config: {
      token: process.env.VUE_APP_AGORA_APP_TOKEN,
      channelName: '',
      appID: process.env.VUE_APP_AGORA_APP_ID
    },
    call: {
      active: false,
      state: '',
      receiverId: ''
    },
    inCall: {
      remoteInvitation: null
    },
    outCall: {
      localInvitation: null
    }
  },
  mutations: {
    updateUserName(state, payload) {
      state.user.name = payload;
    },
    updateUserID(state, payload) {
      state.user.id = payload;
    },
    updateCallStatus(state, payload) {
      state.call.active = payload;
    },
    updateCallReceiverId(state, payload) {
      state.call.receiverId = payload;
    },
    updateRemoteInvitation(state, payload) {
      state.inCall.remoteInvitation = payload;
    },
    updateLocalInvitation(state, payload) {
      state.outCall.localInvitation = payload;
    },
    updateConfig(state, payload) {
      state.config = { ...state.config, ...payload };
    },
    updateRTMClient(state, payload) {
      state.RTMClient = payload;
    }
  },
  actions: {
    loginUser({ commit }, { name, id }) {
      commit('updateUserName', name);
      commit('updateUserID', id);
    },
    logoutUser({ commit }) {
      commit('updateUserName', '');
      commit('updateUserID', '');
    },
    setCallStatus({ commit }, payload) {
      commit('updateCallStatus', payload);
    },
    setStateCallStarted({ commit }, { state, receiverId }) {
      commit('updateCallStatus', state);
      commit('updateCallReceiverId', receiverId);
    },
    setRemoteInvitation({ commit }, payload) {
      commit('updateRemoteInvitation', payload);
    },
    setLocalInvitation({ commit }, payload) {
      commit('updateLocalInvitation', payload);
    },
    updateConfig({ commit }, payload) {
      commit('updateConfig', payload);
    },
    updateRTMClient({ commit }, payload) {
      commit('updateRTMClient', payload);
    }
  }
});
