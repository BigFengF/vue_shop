import Vue from 'vue'
import Vuex from 'vuex'

import { getUserInfo, setUserInfo } from '@/config/storage'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        userInfo: getUserInfo() || null
        // roleInfo: getRoleInfo() || null
    },
    actions: {
        saveUser (context, value) {
            context.commit('SAVEUSER', value)
            setUserInfo(value)
        }
    },
    mutations: {
        SAVEUSER (state, value) {
            state.userInfo = value
        }
    }
})

export default store
