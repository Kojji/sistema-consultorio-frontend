<template>
  <q-layout view="hHh lpR fFf" class="bg--image" :style="$q.screen.lt.md ? '' : 'display: table;'">
    <div id="registro" :style="$q.screen.lt.md ? '' : 'display: table-cell; vertical-align: middle;'">
      <div class="q-pa-md">
        <div class="row">
          <div class="col-12 col-md-5 offset-md-6" :class="!$q.screen.lt.md ? 'offset-md-4' : 'offset-md-4'">
            <q-stepper
              v-model="stepRegistro"
              vertical
              style="padding-bottom: 0"
              color="primary"
              animated
              class="text-center"
            >
              <img src="" />
              <p class="text-subtitle2">Registro</p>
              <q-step :name="1" title="Dados pessoais" :done="stepRegistro > 1">
                <div class="q-pa-md">
                  <div class="q-col-gutter-md row">
                    <div class="col-12">
                      <q-input outlined v-model="registro.name" label="Nome Completo" input-class="nomeRegistro" dense />
                    </div>
                    <div class="col-12">
                      <q-input
                        outlined
                        v-model="registro.cpf"
                        label="CPF"
                        mask="###.###.###-##"
                        dense
                      />
                    </div>
                    <div class="col-12">
                      <q-input
                        outlined
                        v-model="registro.birthday"
                        label="Data de Nascimento"
                        mask="##/##/####"
                        placeholder="DD/MM/AAAA"
                        dense
                      />
                    </div>
                  </div>
                </div>
                <q-stepper-navigation>
                  <q-btn
                    @click="$store.commit('register/setStep', 2)"
                    no-caps
                    color="positive"
                    label="Continuar"
                  >
                  </q-btn>
                </q-stepper-navigation>
              </q-step>
              <q-step :name="2" :done="stepRegistro > 2" title="Dados de Acesso">
                <div class="q-pa-md">
                  <div class="q-col-gutter-md row">
                    <div class="col-12">
                      <q-input outlined v-model="registro.username" label="Nome de Usuário" dense />
                    </div>
                    <div class="col-12">
                      <q-input outlined v-model="registro.email" type="email" label="E-mail" dense />
                    </div>
                    <div class="col-12">
                      <q-input
                        :disable="savingRegistro"
                        dense
                        outlined
                        type="password"
                        v-model="new_password"
                        label="Sua nova senha"
                        @input="value => countPwdRules(value)"
                      >
                        <template v-slot:append>
                          <q-icon name="help_outline" />
                          <q-tooltip
                            :anchor="!$q.screen.lt.md ? 'bottom middle' : 'top middle'"
                            :self="!$q.screen.lt.md ? 'top middle' : 'bottom middle'"
                            content-style="font-size: 12px"
                            :offset="[10, 10]"
                            content-class="bg-grey-8"
                          >
                            A senha precisa conter:<br>
                            <q-icon :name="pwdRules.r1 ? 'check' : 'close'" /> Pelo menos uma letra<br>
                            <q-icon :name="pwdRules.r2 ? 'check' : 'close'" /> Pelo menos um número<br>
                            <q-icon :name="pwdRules.r3 ? 'check' : 'close'" /> No mínimo 6 caracteres.
                          </q-tooltip>
                        </template>
                      </q-input>
                      <div class="q-pl-md q-pr-md q-pt-none">
                        <q-linear-progress reverse :value="pwdRules.value"  color="grey-3" class="q-mt-md" />
                        <p class="text-caption text-left">Requisitos da Senha</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <q-input
                      :disable="savingRegistro"
                      dense
                      outlined
                      type="password"
                      v-model="confirm_password"
                      label="Repita sua nova senha"
                      :rules="[ checkPwd ]"
                    />
                  </div>
                </div>
                <q-stepper-navigation>
                  <q-btn
                    @click="$store.commit('register/setStep', 1)"
                    no-caps
                    color="secondary"
                    label="Voltar"
                    class="q-mr-sm"
                  >
                  </q-btn>
                  <q-btn
                    @click="finishRegister"
                    no-caps
                    color="positive"
                    label="Finalizar"
                    class="q-ml-sm"
                    :loading="savingRegistro"
                  >
                    <template v-slot:loading>
                      <q-spinner color="white" size="1em" />
                    </template>
                  </q-btn>
                </q-stepper-navigation>
              </q-step>
              <q-step :name="3" title="Finalizado">
                Você concluiu o preenchimento do cadastro no Cadastra-Re com sucesso!
                <br />
                <br />Seu cadastro será ativado assim que um dos administradores do sistema aprovarem seu pedido.
                <br />
                <br />Respeitosamente, Equipe Cadastra-Re.
              </q-step>
              <q-separator />
              <div class="text-center" style="padding: 0;margin: 0">
                <q-btn to="/login" label="Entrar na minha Conta" flat class="full-width" no-caps />
              </div>
            </q-stepper>
          </div>
        </div>
      </div>
    </div>
  </q-layout>
</template>

<script>
export default {
  name: 'registro',
  meta: {
    title: 'Cadastra-Re',
    titleTemplate: title => `${title} - Cadastrar`
  },
  data: () => ({
    registro: {
      name: '',
      email: '',
      cpf: '',
      username: '',
      birthday: ''
    },
    new_password: '',
    confirm_password: '',
    pwdRules: {
      value: 1,
      r1: false,
      r2: false,
      r3: false
    }
  }),
  computed: {
    savingRegistro: {
      get () {
        return this.$store.getters['register/getSaving']
      },
      set (value) {
        this.$store.commit('register/setSaving', value)
      }
    },
    stepRegistro: {
      get () {
        return this.$store.getters['register/getStep']
      },
      set (value) {
        this.$store.commit('register/setStep', value)
      }
    },
    isAluno () {
      return this.$route.path === '/registro/aluno'
    }
  },
  methods: {
    checkPwd () {
      return (this.new_password === this.confirm_password || 'As senhas não coincidem.')
    },
    getBarValue (r1, r2, r3) {
      if (r1 && r2 && r3) {
        return 0
      }
      if (r1 && r2 && !r3) {
        return 0.25
      }
      if (r1 && !r2 && r3) {
        return 0.25
      }
      if (r1 && !r2 && !r3) {
        return 0.5
      }
      if (!r1 && r2 && r3) {
        return 0.5
      }
      if (!r1 && r2 && !r3) {
        return 0.75
      }
      if (!r1 && !r2 && r3) {
        return 0.75
      }
      return 1
    },
    countPwdRules (value) {
      if (value.length === 0) {
        this.pwdRules.value = 1
      }

      this.pwdRules.r1 = value.length >= 6

      const testeL = /[a-zA-Z]/

      this.pwdRules.r2 = testeL.test(value)

      const testeN = /[0-9]/

      this.pwdRules.r3 = testeN.test(value)

      this.pwdRules.value = this.getBarValue(this.pwdRules.r1, this.pwdRules.r2, this.pwdRules.r3)
    },
    finishRegister () {
      const user = JSON.parse(JSON.stringify(this.registro))
      user.password = this.new_password
      this.$store.dispatch('register/sendRegister', user)
    }
  },
  mounted () {
    this.$store.commit('register/setStep', 1)
  }
}
</script>

<style>
.bg--image {
  /* background: url(../../assets/capa.jpg) no-repeat center center fixed; */
  background-size: cover;
  height: 100%;
  overflow: hidden;
}
.q-linear-progress__track--light {
  background: rgb(38,159,62);
  background: -moz-linear-gradient(90deg, rgba(38,159,62,1) 0%, rgba(242,244,20,1) 50%, rgba(210,25,25,1) 100%);
  background: -webkit-linear-gradient(90deg, rgba(38,159,62,1) 0%, rgba(242,244,20,1) 50%, rgba(210,25,25,1) 100%);
  background: linear-gradient(90deg, rgba(38,159,62,1) 0%, rgba(242,244,20,1) 50%, rgba(210,25,25,1) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#269f3e",endColorstr="#d21919",GradientType=1);
  opacity: 1;
}
</style>
