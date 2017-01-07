import VueRouter from 'vue-router'

import Index from './Index.vue'
import Register from './Register.vue'
import NewQuestion from './NewQuestion.vue'

export default () => new VueRouter({
  mode: 'history',
  scrollBehavior: (to, from, saved) => saved ? saved : { x:0, y:0 },
  routes: [
    { path: '/', component: Index },
    { path: '/register', component: Register },
    { path: '/new-question', component: NewQuestion }
  ]
})
