import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/login.vue'
import home from './components/home.vue'
import welcome from './components/welcome.vue'
import users from './components/user/users.vue'
import rights from './components/power/rights.vue'
import roles from './components/power/roles.vue'
import cate from './components/goods/cate.vue'
import params from './components/goods/params.vue'
import list from './components/goods/list.vue'
import add from './components/goods/add.vue'
import order from './components/order/order.vue'
import report from './components/report/report.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/reports', component: report },
    {
      path: '/home',
      component: home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: welcome },
        { path: '/users', component: users },
        { path: '/rights', component: rights },
        { path: '/roles', component: roles },
        { path: '/categories', component: cate },
        { path: '/params', component: params },
        { path: '/goods', component: list },
        { path: '/goods/add', component: add },
        { path: '/orders', component: order }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  // to表示将要访问的路径
  // from表示从哪个路径跳转而来
  // next是一个函数，表示放行
  if (to.path === '/login') return next()
  const tokenstr = window.sessionStorage.getItem('token')
  if (!tokenstr) return next('/login')
  else next()
})
export default router
