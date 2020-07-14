import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入配置element
import './plugins/element.js'
import BootstrapVue from 'bootstrap-vue'
import 'element-ui/lib/theme-chalk/index.css';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// 导入全局属性
import './assets/mainCss.css'
import mainJs from './assets/mainJs.js'
// 导入配置axios
import axios from 'axios'
Vue.prototype.$http = axios
axios.defaults.baseURL = "https://bird.ioliu.cn/v1/?url=" + "http://m.music.migu.cn/migu/remoting/" //给axios配置访问头 
Vue.prototype.$toMusic = mainJs

Vue.config.productionTip = false

Vue.use(BootstrapVue)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
