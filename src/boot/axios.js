import axios from 'axios'
import { Cookies } from 'quasar'
import inject from 'src/inject'

export default inject(async function ({ ssrContext, store, router }) {
  const instance = axios.create({
    baseURL: process.env.VUE_APP_URL_API,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })

  const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies

  instance.interceptors.request.use(
    function (config) {
      const token = cookies.get('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    function (error) {
      return Promise.reject(error)
    }
  )

  // instance.interceptors.response.use(
  //   function (response) {
  //     if (!response.data.success) {
  //       if (!!response.data.redirect) {
  //         store.dispatch('signedin/logoutRoutine', response.data)
  //       }
  //     }
  //     return response
  //   }, function (error) {
  //     return Promise.reject(error)
  //   }
  // )

  return {
    axios: instance
  }
})
