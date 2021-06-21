import Vue from 'vue'
import VueRouter from 'vue-router'
import { Cookies } from 'quasar'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (context) {
  context.router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes: routes(context),

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  context.router.beforeEach((to, from, next) => {
    // let { router, store } = context;
    // let { $axios } = router;

    const cookies = process.env.SERVER
      ? Cookies.parseSSR(context.ssrContext)
      : Cookies // otherwise we're on client

    if (
      to.matched.some(record => record.meta.requiresAuth) &&
      !cookies.get('token')
    ) {
      next('/login')
    } else if (
      !to.matched.some(record => record.meta.requiresAuth) && to.matched.path === '/login' && cookies.get('token')
    ) {
      next('/')
    } else if (!to.matched.some(record => record.meta.requiresAuth) &&
    to.matched.path !== '/login') {
      cookies.remove('token')
    }
    next()
  })

  return context.router
}
