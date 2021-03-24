import Vue from 'vue'
import router from '@/router'
import App from './App.vue'
import axios from '@/apis/apis'


Vue.config.productionTip = false
Vue.prototype.$axios = axios
Date.prototype.toLocaleString = function () {
  return this.getFullYear()+'-'+(this.getMonth()+1)+'-'+this.getDate()+' '+this.getHours()+':'+this.getMinutes()+':'+this.getSeconds()
  };

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
