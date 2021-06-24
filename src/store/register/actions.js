import axios from 'axios'
import { Notify } from 'quasar'

axios.defaults.baseURL = process.env.VUE_APP_URL_API

export function sendRegister ({ commit }, dadosRegistro) {
  commit('setSaving', true)
  axios
    .post('/users/register', dadosRegistro, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.data.success) {
        Notify.create({
          message: res.data.message,
          color: 'green',
          position: 'top-right'
        })
        commit('setStep', 3)
      } else {
        Notify.create({
          message: res.data.message,
          color: 'orange',
          position: 'top-right'
        })
      }
      commit('setSaving', false)
    })
    .catch(() => {
      commit('setSaving', false)
      Notify.create({
        message:
          'Algo inesperado aconteceu, e não foi possível finalizar o Registro.',
        color: 'red',
        position: 'top-right'
      })
    })
}
