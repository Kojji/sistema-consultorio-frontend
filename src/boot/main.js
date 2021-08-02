import 'src/mixins/mixins'

// "async" is optional
export default async ({ /* app, router, Vue, ... */ Vue }) => {
  Vue.config.productionTip = true

  if (process.env.DEV) {
    // eslint-disable-next-line no-console
    console.log('Modo de Desenvolvimento: ' + process.env.VUE_APP_URL_API)
  }
}
