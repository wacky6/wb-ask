// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import plugins from './our-vue-plugins.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import createRouter from './route-config.js'

Vue.use(VueRouter)
Vue.use(ElementUI)

// register our plugin bundle
Vue.use(plugins)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router: createRouter()
})
