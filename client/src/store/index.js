import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 로그인한 상태인지 로그아웃한 상태인지
export default new Vuex.Store({
  state: {
    user: null
  },
  getters: {
  },
  mutations: {
    // 로그인한 상태면 user
    setUser(state, user) {
      state.user = user
    },
    // 로그아웃한 상태면 null
    logout(state) {
      state.user = null
    }
  },
  actions: {
  },
  modules: {
  }
})
