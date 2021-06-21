export default function () {
  const routes = [
    {
      path: '/',
      component: () => import('layouts/MainLayout.vue'),
      meta: {
        requiresAuth: true
      },
      children: [
        { path: '', redirect: '/fichas' },
        { path: 'fichas', component: () => import('pages/Forms.vue') },
        { path: 'usuarios', component: () => import('pages/Users.vue') },
        { path: 'perfil', component: () => import('pages/Profile.vue') }
      ]
    },
    {
      path: '/login',
      component: () => import('src/pages/Login.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '*',
      component: () => import('pages/Error404.vue'),
      meta: {
        requiresAuth: false
      }
    }
  ]

  return routes
}
