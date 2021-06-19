
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'fichas', component: () => import('pages/Forms.vue') },
      { path: 'usuarios', component: () => import('pages/Users.vue') }
    ]
  },
  {
    path: '/login',
    component: () => import('src/pages/Login.vue')
  },
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
