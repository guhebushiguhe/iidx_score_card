import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        globalConfig: {
            name: 'iidx',
            version: '27'
        },
    },
    mutations: {
        setGlobalConfig (state, conf) {
            state.globalConfig = conf
        }
    }
})

export default store