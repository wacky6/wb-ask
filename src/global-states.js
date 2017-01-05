import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

const globalStateStorage = new Vuex.Store({
  state: {
    user: null,
    token: null
  },
  mutations: {
    login(state, user, token) {
      state.user = user
      state.token = token
    },
    logout(state) {
      state.user = null
      state.token = null
    }
  },

})

export default globalStateStorage
