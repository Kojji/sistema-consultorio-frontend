import globalAxios from 'axios'

globalAxios.defaults.baseURL = process.env.VUE_APP_URL_API

export function login ({ commit }, userData) {
  return new Promise((resolve, reject) => {
    globalAxios
      .post('/auth/login', userData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export function alwaysOn ({ commit, state }) {
  return new Promise((resolve, reject) => {
    this.$axios
      .post('/auth/token')
      .then(res => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
