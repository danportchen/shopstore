import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import 'bootstrap'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)

Vue.component('Loading', loading)

axios.defaults.withCredentials = true

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

router.beforeEach((to, from, next) => {
  // console.log(to, from, next)
  if (to.meta.requiresAuth) {
    const api = `${process.env.VUE_APP_APIPATH}/api/user/check`
    axios.post(api).then(response => {
      console.log(response.data)
      if (response.data.success) {
        next()
      } else {
        next({
          path: '/login'
        })
      }
    })
  } else {
    next()
  }
})
