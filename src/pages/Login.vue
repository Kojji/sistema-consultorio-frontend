<template>
  <q-layout view="hHh lpR fFf" class="bg--image" :style="$q.screen.lt.md ? '' : 'display: table;'">
    <div id="Login" :style="$q.screen.lt.md ? '' : 'display: table-cell; vertical-align: middle;'">
      <div class="q-pa-md">
        <div class="row">
          <div class="col-12 col-md-5 offset-md-6" :class="!$q.screen.lt.md ? 'offset-md-4' : 'offset-md-4'">
            <q-card class="bg-white">
              <q-card-section class="text-center">
              </q-card-section>

              <q-card-section>
                <q-form @submit="onSubmit" class="q-gutter-md">
                  <q-input
                    dense
                    type="username"
                    v-model="username"
                    label="E-mail ou Usuário"
                    outlined
                    bottom-slots
                    :error-message="getErrorMessage('username')"
                    :error="isError('username')"
                  />

                  <q-input
                    dense
                    outlined
                    type="password"
                    @keydown.enter="onSubmit"
                    v-model="senha"
                    label="Senha"
                    bottom-slots
                    :error-message="getErrorMessage('password')"
                    :error="isError('password')"
                  />
                  <br />
                </q-form>
                <q-btn
                  label="Entrar"
                  no-caps
                  @click="onSubmit()"
                  class="bg-primary text-white full-width"
                  :loading="false"
                >
                  <template v-slot:loading>
                    <q-spinner color="white" size="1em" />
                  </template>
                </q-btn>
              </q-card-section>
              <q-card-section align="center" class="q-pb-xs">
                <q-btn
                  to="/esqueci-senha"
                  label="Esqueci minha senha"
                  flat
                  :disable="true"
                  color="secondary"
                  no-caps
                >
                </q-btn>
                <q-tooltip
                  :anchor="!$q.screen.lt.md ? 'bottom middle' : 'top middle'"
                  :self="!$q.screen.lt.md ? 'top middle' : 'bottom middle'"
                  content-style="font-size: 12px"
                  :offset="[10, 10]"
                  content-class="bg-grey-8"
                >Solicite diretamente com um administrador!</q-tooltip>
              <!-- <p class="text-body2 text-grey-8">Ainda não tem uma conta?</p> -->
              </q-card-section>
              <q-card-section align="center" class="q-pt-xs">
                <q-btn
                  to="/criar-conta"
                  label="Solicitar acesso"
                  flat
                  color="primary"
                  no-caps
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-layout>
</template>

<script>
export default {
  name: 'Login',
  meta: {
    title: 'Cadastra-Re',
    titleTemplate: title => `${title} - Entre na sua Conta`
  },
  // beforeCreate () {
  // this.$store.dispatch('signedin/logout')
  // },
  props: ['footer'],
  data () {
    return {
      username: null,
      senha: null,
      errors: []
    }
  },
  methods: {
    onSubmit () {
      this.errors = []
      if (this.$q.cookies.has('token')) {
        this.$q.cookies.remove('token')
      }
      this.$store
        .dispatch('login/login', {
          username: this.username,
          password: this.senha
        })
        .then(res => {
          if (res.data.success) {
            this.$q.cookies.set('token', res.data.token, { path: '/' })
            this.$store.commit('login/setColunas', res.data.menus)
            // this.$store.dispatch("chat/connect", { socket: this.$socket, token: res.data.token });
            // this.$store.dispatch("users/updateConnectStatus", { token: res.data.token, status: true });
            // this.$store.commit("signedin/signed", true);
            // this.$store.commit("signedin/token", res.data.token);
            this.$store.commit('login/user', res.data.user)
            // if (!res.data.user.confirmed) {
            //   this.$store.commit("login/newUser", true);
            // }
            this.$router.push(res.data.redirect)
          } else {
            // this.$store.commit('signedin/signed', false);
            // this.$store.commit("chat/socket", {});
            // this.$store.commit("signedin/token", null);
            this.$store.commit('login/login', {
              message: res.data.message,
              isLogged: false
            })
            // Notify.create({
            //   message: res.data.message,
            //   color: "orange",
            //   position: "top-right"
            // });
            // this.$store.commit('login/redirect', res.data.redirect)
            // this.$router.push(res.data.redirect)
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: typeof err.response.data.message === 'string' ? err.response.data.message : 'Não foi possível concactar, ou você não possui permissão',
            position: 'top-right',
            color: 'red',
            icon: 'mdi-alert'
          })
          this.errors = err.response.data.message
          // this.$store.commit('signedin/signed', false)
          // this.$store.commit('signedin/token', null)
          this.$store.commit('login/login', {
            message: '',
            isLogged: false
          })
        })
    },
    getErrorMessage (field) {
      // return !!this.errors[0] && this.errors[0][field] ? this.errors[0][field] : ''
    },
    isError (field) {
      // return !!this.errors && !!this.errors[0] && !!this.errors[0][field]
    }
  },
  computed: {
    dadosLogin () {
      return null
      // return this.$store.getters["login/login"];
    }
  }
}
</script>

<style>
.bg--image {
  /* background: url(../../assets/capa.jpg) no-repeat center center fixed;  */
  background-size: cover;
  height: 100%;
  overflow: hidden;
}
</style>
