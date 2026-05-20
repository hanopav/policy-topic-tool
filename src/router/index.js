import { createRouter, createWebHistory } from 'vue-router'

import Quiz from '../components/Quiz.vue'
import Data from '../components/Data.vue'
import Graph from '../components/Graph.vue'

const routes = [
  {
    path: '/',
    name: 'quiz',
    component: Quiz,
    meta: {
      title: 'Policy Assessment'
    }
  },
  {
    path: '/data',
    name: 'data',
    component: Data,
    meta: {
      title: 'Evidence Base'
    }
  },
    {
    path: '/graph',
    name: 'graph',
    component: Graph,
    meta: {
      title: 'Visualisation'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} | Policy Action Navigator`
    : 'Policy Action Navigator'
})

export default router