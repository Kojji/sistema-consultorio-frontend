<template>
  <div class="q-col-gutter-md row">
    <div class="col-12 col-md-6 offset-md-3">
      <q-card>
        <q-item>
          <q-item-section avatar @mouseenter="showCamera = true, showPhoto = false" @mouseleave="showCamera = false, showPhoto = true">
            <q-avatar :color="!user.photo ? 'secondary text-white' : ''">
              <img v-show="showPhoto" contain v-if="user.photo" :src="user.photo" />
              <span v-show="showPhoto" v-else>{{ sigla(user.name) }}</span>
              <span v-show="showCamera">
                <q-btn :loading="uploadingPhoto" @click="$refs.filePicker.pickFiles()" flat dense round icon="mdi-camera-flip">
                  <q-tooltip
                    :anchor="!$q.screen.lt.md ? 'bottom middle' : 'top middle'"
                    :self="!$q.screen.lt.md ? 'top middle' : 'bottom middle'"
                    content-style="font-size: 12px"
                    :offset="[10, 10]"
                    content-class="bg-grey-8"
                  >{{ !!user.photo ? 'Trocar Foto' : 'Adicionar Foto' }}</q-tooltip>
                </q-btn>
                <q-file @input="file => uploadImage(file)" style="display:none" ref="filePicker" accept=".jpg, image/*" v-model="file" label="Standard" />
              </span>
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ user.name }}</q-item-label>
          </q-item-section>

          <q-item-section side>

          </q-item-section>
        </q-item>

        <q-separator />
        <q-card-section class="q-pa-none">
          <q-splitter
              v-model="splitterModel"
              :limits="[splitterModel, splitterModel]"
              :horizontal="$q.screen.lt.md"
            >
              <template v-slot:before>
                <q-tabs
                  v-model="tab"
                  class="text-secondary"
                  no-caps
                  :vertical="$q.screen.gt.sm"
                >
                  <q-tab class="text-left" name="infos" label="Informações" />
                  <!-- <q-tab class="text-left" name="conta" label="Conta" /> -->
                  <q-tab class="text-left" name="acesso" label="Acesso & Segurança" />
                </q-tabs>
              </template>

              <template v-slot:after>
                <q-tab-panels
                  v-model="tab"
                  animated
                  transition-prev="jump-down"
                  transition-next="jump-up"
                >
                  <q-tab-panel name="infos" class="q-pl-none q-pr-none">
                    <div class="q-pa-md">
                      <div class="q-col-gutter-md row">
                        <div class="col-12">
                          <q-input :disable="saving" outlined label="Nome" dense v-model="usuario.name" />
                        </div>
                        <div class="col-12 col-md-6">
                          <q-input :disable="saving" outlined label="Data de Nascimento" dense v-model="usuario.birthday" mask="##/##/####" />
                        </div>
                        <div class="col-12 col-md-6">
                          <q-input :disable="saving" outlined label="CPF" dense v-model="usuario.cpf" mask="###.###.###-##" />
                        </div>
                        <div class="col-12 text-right">
                          <q-btn :loading="saving" @click="updateInfos" label="Salvar" no-caps no-wrap color="green" />
                        </div>
                      </div>
                    </div>
                  </q-tab-panel>
                  <!-- <q-tab-panel name="conta" class="q-pl-none q-pr-none">
                    Oi
                  </q-tab-panel> -->
                  <q-tab-panel name="acesso" class="q-pl-none q-pr-none">
                    <div class="q-pa-md">
                      <div class="q-col-gutter-md row">
                        <div class="col-12 q-pt-none">
                          <div class="text-h6">
                            Troque sua senha
                          </div>
                          <q-separator />
                        </div>
                        <div class="col-12">
                          <div class="q-col-gutter-md row">
                            <div class="col-12 col-md-6">
                              <q-input
                                :disable="saving"
                                dense
                                outlined
                                type="password"
                                v-model="password"
                                label="Sua senha atual"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-12 col-md-6">
                          <q-input
                            :disable="saving"
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
                        <div class="col-12 col-md-6">
                          <q-input
                            :disable="saving"
                            dense
                            outlined
                            type="password"
                            v-model="confirm_password"
                            label="Repita sua nova senha"
                            :rules="[ checkPwd ]"
                          />
                        </div>
                        <div class="col-12 text-right">
                          <q-btn :loading="saving" @click="updatePassword" label="Salvar" no-caps no-wrap color="green" />
                        </div>
                      </div>
                      <div class="q-col-gutter-md row">
                        <div class="col-12 q-pt-none">
                          <div class="text-h6">
                            Troque seu login
                          </div>
                          <q-separator />
                        </div>
                        <div class="col-12">
                          <div class="q-col-gutter-md row">
                            <div class="col-12 col-md-6">
                              <q-input
                                :disable="saving"
                                dense
                                outlined
                                type="password"
                                v-model="password2"
                                label="Sua senha atual"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-12">
                          <div class="q-col-gutter-md row">
                            <div class="col-12 col-md-6">
                              <q-input
                                :disable="saving"
                                dense
                                outlined
                                label="Seu novo endereço de email"
                                v-model="usuario.email"
                              />
                            </div>
                            <div class="col-12 col-md-6">
                              <q-input
                                :disable="saving"
                                outlined
                                label="Login"
                                dense
                                v-model="usuario.username"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-12 text-right">
                          <q-btn :loading="saving" @click="updateLogin" label="Salvar" no-caps no-wrap color="green" />
                        </div>
                      </div>
                    </div>
                  </q-tab-panel>
                </q-tab-panels>
              </template>
          </q-splitter>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  meta: {
    title: 'Casdatra-Re',
    titleTemplate: title => `${title} - Perfil`
  },
  data: () => ({
    tab: 'infos',
    usuario: {},
    showCamera: false,
    showPhoto: true,
    uploadingPhoto: false,
    file: null,
    password: '',
    password2: '',
    new_password: '',
    confirm_password: '',
    pwdRules: {
      value: 1,
      r1: false,
      r2: false,
      r3: false
    },
    saving: false
  }),
  methods: {
    sigla (user) {
      const nome = String(user)
      const nomeArray = nome.split(' ')

      return nomeArray[0][0] + nomeArray[nomeArray.length - 1][0]
    },
    getAreas () {
      this.$axios.get('/areas')
        .then(res => {
          if (res.data.success) {
            this.areas = res.data.data
          }
        })
    },
    updateInfos () {
      this.$q
        .dialog({
          title: this.user.name,
          message:
            'Tem certeza que deseja atualizar as informações básicas do seu usuário?',
          cancel: 'Cancelar',
          persistent: true
        })
        .onOk(() => {
          this.$q.loading.show()
        })
        .onOk(() => {
          this.saving = true
          const user = {
            name: this.usuario.name,
            birthday: this.usuario.birthday,
            cpf: this.usuario.cpf
          }
          this.$axios.put('/users/' + this.user.id, user)
            .then(res => {
              if (res.data.success) {
                this.$q.dialog({
                  title: res.data.message,
                  class: 'bg-positive text-white',
                  ok: {
                    'text-color': 'green',
                    color: 'white'
                  }
                })
                Object.assign(this.user, user)
              }
            })
            .catch((err) => {
              this.$q.dialog({
                title: err.response.data.message,
                class: 'bg-negative text-white',
                ok: {
                  'text-color': 'red',
                  color: 'white'
                }
              })
            })
            .finally(() => {
              this.saving = false
            })
        })
        .onCancel(() => {
          this.$q.loading.hide()
        })
        .onDismiss(() => {
          this.$q.loading.hide()
        })
    },
    updateLogin () {
      this.$q
        .dialog({
          title: 'Troca de login',
          message:
            'Tem certeza que deseja atualizar suas informações de acesso?',
          cancel: 'Cancelar',
          persistent: true
        })
        .onOk(() => {
          this.$q.loading.show()
        })
        .onOk(() => {
          this.saving = true
          this.$axios.post('/users/change-login', {
            oldPassword: this.password2,
            email: this.usuario.email,
            username: this.usuario.username
          })
            .then(res => {
              if (res.data.success) {
                this.$q.notify({
                  message: res.data.message,
                  color: 'green',
                  position: 'top-right',
                  icon: 'mdi-tooltip-check-outline'
                })
                this.password2 = ''
                Object.assign(this.user, {
                  email: this.usuario.email,
                  username: this.usuario.username
                })
              }
            })
            .catch(err => {
              this.$q.notify({
                message: err.response.data.message,
                color: 'red',
                position: 'top-right',
                icon: 'mdi-alert'
              })
            })
            .finally(() => {
              this.saving = false
            })
        })
        .onCancel(() => {
          this.$q.loading.hide()
        })
        .onDismiss(() => {
          this.$q.loading.hide()
        })
    },
    updatePassword () {
      this.$q
        .dialog({
          title: 'Troca de senha',
          message:
            'Tem certeza que deseja atualizar suas informações de acesso?',
          cancel: 'Cancelar',
          persistent: true
        })
        .onOk(() => {
          this.$q.loading.show()
        })
        .onOk(() => {
          this.saving = true
          this.$axios.post('/users/change-password', {
            oldPassword: this.password,
            password: this.new_password
          })
            .then(res => {
              if (res.data.success) {
                this.$q.notify({
                  message: res.data.message,
                  color: 'green',
                  position: 'top-right',
                  icon: 'mdi-tooltip-check-outline'
                })
                this.password = ''
                this.new_password = ''
                this.confirm_password = ''
              }
            })
            .catch(err => {
              this.$q.notify({
                message: err.response.data.message,
                color: 'red',
                position: 'top-right',
                icon: 'mdi-alert'
              })
            })
            .finally(() => {
              this.saving = false
            })
        })
        .onCancel(() => {
          this.$q.loading.hide()
        })
        .onDismiss(() => {
          this.$q.loading.hide()
        })
    },
    uploadImage (file) {
      this.uploadingPhoto = true
      const fileFormData = new FormData()
      fileFormData.append('file', file)

      this.$axios.post('/users/upload/' + this.user.id, fileFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(res => {
          if (res.data.success) {
            this.$q.notify({
              message: res.data.message,
              color: 'green',
              position: 'top-right',
              icon: 'mdi-tooltip-check-outline'
            })
            this.user.photo = res.data.url_storage
          }
        })
        .catch(err => {
          this.$q.notify({
            message: err.response.data.message,
            color: 'red',
            position: 'top-right',
            icon: 'mdi-alert'
          })
        })
        .finally(() => {
          this.uploadingPhoto = false
        })
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
    checkPwd () {
      return (this.new_password === this.confirm_password || 'As senhas não coincidem.')
    },
    async addArea (area) {
      await this.$axios.post(`/users/areas/${area.id}`)
    },
    async removeArea (area) {
      await this.$axios.delete(`/users/areas/${area.id}`)
    }
  },
  computed: {
    splitterModel () {
      return this.$q.screen.gt.md ? 20 : 25
    },
    user: {
      get () {
        return this.$store.getters['login/user']
      },
      set (value) {
        this.$store.commit('login/user', value)
      }
    }
  },
  mounted () {
    this.usuario = JSON.parse(JSON.stringify(this.user))
  }
}
</script>

<style lang="scss">
.q-linear-progress__track--light {
  background: rgb(38,159,62);
  background: -moz-linear-gradient(90deg, rgba(38,159,62,1) 0%, rgba(242,244,20,1) 50%, rgba(210,25,25,1) 100%);
  background: -webkit-linear-gradient(90deg, rgba(38,159,62,1) 0%, rgba(242,244,20,1) 50%, rgba(210,25,25,1) 100%);
  background: linear-gradient(90deg, rgba(38,159,62,1) 0%, rgba(242,244,20,1) 50%, rgba(210,25,25,1) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#269f3e",endColorstr="#d21919",GradientType=1);
  opacity: 1;
}
</style>
