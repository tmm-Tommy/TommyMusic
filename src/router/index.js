import Vue from 'vue'
import VueRouter from 'vue-router'
// 懒加载
const Home = () => import('@/views/Home.vue')
const Music = () => import('@/views/Music.vue')
const Play = () => import('@/views/Play.vue')


Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'Home',
  component: Home,
  redirect: "/music",
  children: [{
    path: "/music",
    component: Music
  }, {
    path: "/play",
    component: Play
  }, ]
}]

const router = new VueRouter({
  routes
})

export default router
