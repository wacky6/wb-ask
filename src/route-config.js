import VueRouter from 'vue-router'

import Index from './Index.vue'
import Register from './Register.vue'
import NewQuestion from './NewQuestion.vue'
import ViewQuestion from './ViewQuestion.vue'
import EditQuestion from './EditQuestion.vue'

export default () => new VueRouter({
  mode: 'history',
  scrollBehavior: (to, from, saved) => saved ? saved : { x:0, y:0 },
  routes: [
    { path: '/', component: Index },
    { path: '/register', component: Register },
    { path: '/question/new',  component: NewQuestion },
    { path: '/question/:qid', component: ViewQuestion },
    { path: '/question/:qid/edit', component: EditQuestion }
      // { path: '/view/:qid': component: ViewQuestion },
      // { path: '/edit/:qid': component: EditQuestion },
  ]
})
