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
    },
    updateWealth(state, num) {
      if (state.user)
        state.user.wealth = num
    }
  },

})

// class mixins for convenience
function user() { return this.$store.state.user || {} }
function loggedOn() { return Boolean(this.$store.state.user) }
function token() { return this.$store.state.token }

export default globalStateStorage
export {user, loggedOn, token}
