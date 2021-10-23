import Vue from 'vue'
import store from '@/store'
import router from '@/router'
import App from './App.vue'
import axios from '@/apis/apis'
import VueClipboard from 'vue-clipboard2'
import '@/utils/appback.js'
import AudioVisual from 'vue-audio-visual'
import {
  Message
} from 'element-ui'

Vue.prototype.$message = Message

Vue.use(VueClipboard)
Vue.use(AudioVisual)
Vue.config.productionTip = false
Vue.prototype.$axios = axios
Date.prototype.toLocaleString = function () {
  return this.getFullYear()+'-'+(this.getMonth()+1)+'-'+this.getDate()+' '+this.getHours()+':'+this.getMinutes()+':'+this.getSeconds()
  };

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
