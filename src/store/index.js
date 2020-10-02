import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      name: '',
      id: ''
    },
    call: {
      active: false,
      state: '',
      receiverId: ''
    }
  },
  mutations: {
    updateUserName(state, payload) {
      state.user.name = payload;
    },
    updateUserID(state, payload) {
      state.user.id = payload;
    },
    updateCallState(state, payload) {
      state.call.state = payload;
    },
    updateCallReceiverId(state, payload) {
      state.call.receiverId = payload;
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
      commit('updateCallState', payload);
    },
    setStateCallStarted({ commit }, { state, receiverId }) {
      commit('updateCallState', state);
      commit('updateCallReceiverId', receiverId);
    }
  }
});
