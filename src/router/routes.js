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
        { path: 'usuarios', component: () => import('src/pages/Users.vue') },
        { path: 'perfil', component: () => import('pages/Profile.vue') },
        { path: 'consultas', component: () => import('pages/Agenda.vue') }
      ]
    },
    {
      path: '/agenda/DraLuciene',
      component: () => import('src/pages/AgendaLimited.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/login',
      component: () => import('src/pages/Login.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/criar-conta',
      component: () => import('src/pages/CreateAccount.vue'),
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
