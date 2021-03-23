import Vue from 'vue'
import router from '@/router'
import App from './App.vue'
import axios from '@/apis/apis'


Vue.config.productionTip = false
Vue.prototype.$axios = axios


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
