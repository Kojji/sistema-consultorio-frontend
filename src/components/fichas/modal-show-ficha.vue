<template>
  <q-dialog v-model="OpenModalUser" persistent>
    <q-card style="width: 400px">
      <q-card-section class="row items-center">
        <q-space />
        <q-btn icon="close" flat round dense @click="closeModal()" />
      </q-card-section>

      <!-- <q-card-section class="q-pt-none" v-if="usuario">
        <div class="q-pt-none">
          <div class="q-col-gutter-md row items-center">
            <div class="col-12 text-center q-pt-none">
              <q-avatar size="76px" :color="!usuario.photo ? 'secondary text-white' : ''">
                <img v-if="usuario.photo" :src="usuario.photo" />
                <span v-else>
                  {{ sigla(usuario.name) }}
                </span>
              </q-avatar>
              <h5 class="q-my-xs">{{ usuario.name }}</h5>
              <p v-if="usuario.role == 1" class="text-caption q-mb-xs">
                Administrador
              </p>
              <p class="text-caption q-mb-xs">
                {{ usuario.email }}
              </p>
              <p class="text-caption">
                {{ usuario.cpf }}
              </p>
              <div class="row">
                <div class="q-mb-sm col">
                  <q-btn
                    v-if="usuario.active"
                    no-caps
                    @click="resetarSenha"
                    :loading="loadingAdminButton"
                    dense
                    outline
                    color="warning"
                    label="Resetar Senha"
                  >
                    <template v-slot:loading>
                      <q-spinner color="primary" size=".8em" />
                    </template>
                  </q-btn>
                </div>
                <div class="q-mb-sm col">
                  <q-btn
                    v-if="usuario.active"
                    no-caps
                    @click="giveAdmin"
                    :disable="usuario.role == 1"
                    :loading="loadingAdminButton"
                    dense
                    outline
                    color="warning"
                    label="Tornar Administrador"
                  >
                    <template v-slot:loading>
                      <q-spinner color="primary" size=".8em" />
                    </template>
                  </q-btn>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <q-btn
                    @click="decline(usuario.active)"
                    :loading="decliningUser"
                    icon="close"
                    class="text-negative"
                    round
                    dense
                    flat
                    :disable="usuario.confirmed!==null && !usuario.active"
                  >
                    <template v-slot:loading>
                      <q-spinner color="primary" size=".8em" />
                    </template>
                    <q-tooltip
                      :anchor="!$q.screen.lt.md ? 'bottom middle' : 'top middle'"
                      :self="!$q.screen.lt.md ? 'top middle' : 'bottom middle'"
                      content-style="font-size: 12px"
                      :offset="[10, 10]"
                      content-class="bg-grey-8"
                    >{{usuario.active ? 'Desativar Usuário' : 'Recusar Cadastro'}}</q-tooltip>
                  </q-btn>
                </div>
                <div class="col">
                  <q-icon class="q-pa-xs" size="24px" name="circle" :color="checkColor(usuario.active)">
                    <q-tooltip
                      :anchor="!$q.screen.lt.md ? 'bottom middle' : 'top middle'"
                      :self="!$q.screen.lt.md ? 'top middle' : 'bottom middle'"
                      content-style="font-size: 12px"
                      :offset="[10, 10]"
                      content-class="bg-grey-8"
                    >{{ checkStatus(usuario.active) }}</q-tooltip>
                  </q-icon>
                </div>
                <div class="col">
                  <q-btn
                    @click="accept()"
                    :loading="acceptingUser"
                    icon="check"
                    class="text-positive"
                    round
                    dense
                    flat
                    :disable="usuario.confirmed && usuario.active"
                  >
                    <template v-slot:loading>
                      <q-spinner color="primary" size=".8em" />
                    </template>
                    <q-tooltip
                      :anchor="!$q.screen.lt.md ? 'bottom middle' : 'top middle'"
                      :self="!$q.screen.lt.md ? 'top middle' : 'bottom middle'"
                      content-style="font-size: 12px"
                      :offset="[10, 10]"
                      content-class="bg-grey-8"
                    >{{usuario.confirmed ? 'Reativar Usuário' : 'Aceitar Cadastro'}}</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section> -->

      <!-- <q-card-section v-else style="height: 300px">

      </q-card-section> -->
      <q-inner-loading :showing="loadingUser">
        <q-spinner color="primary" size="3em" />
        <p class="q-mt-md">Trazendo informações do usuário...</p>
      </q-inner-loading>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'modalShowUser',
  props: {
    OpenModal: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    loadingUser: false,
    acceptingUser: false,
    decliningUser: false,
    loadingAdminButton: false,
    usuario: null
  }),
  methods: {
    checkStatus (active) {
      if (active === true) {
        return 'Usuário Ativo'
      } else {
        return 'Usuário Inativo'
      }
    },
    checkColor (active) {
      if (active === true) {
        return 'positive'
      } else {
        return 'negative'
      }
    },
    accept () {
      this.acceptingUser = true
      const user = {
        name: this.usuario.name,
        username: this.usuario.username,
        birthday: this.usuario.birthday,
        email: this.usuario.email,
        cpf: this.usuario.cpf,
        confirmed: true,
        active: true
      }
      this.$axios.put('users/edit/' + this.usuario.id, user)
        .then(res => {
          if (res.data.success) {
            this.$q.notify({
              message: res.data.message,
              color: 'green',
              position: 'top-right'
            })
            this.$emit('repaginate')
            this.getFicha()
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: err.response.data.message,
            color: 'red',
            position: 'top-right'
          })
        })
        .finally(() => {
          this.acceptingUser = false
          this.closeModal()
        })
    },
    decline (active) {
      this.decliningUser = true
      const user = {
        name: this.usuario.name,
        username: this.usuario.username,
        birthday: this.usuario.birthday,
        email: this.usuario.email,
        cpf: this.usuario.cpf,
        confirmed: active,
        active: false
      }
      this.$axios.put('users/edit/' + this.usuario.id, user)
        .then(res => {
          if (res.data.success) {
            this.$q.notify({
              message: res.data.message,
              color: 'green',
              position: 'top-right'
            })
            this.$emit('repaginate')
            this.getFicha()
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: err.response.data.message,
            color: 'red',
            position: 'top-right'
          })
        })
        .finally(() => {
          this.decliningUser = false
          this.closeModal()
        })
    },
    giveAdmin () {
      this.$q
        .dialog({
          title: this.usuario.name,
          message:
            'Tem certeza que deseja tornar usuário em administrador?',
          cancel: 'Cancelar',
          persistent: true
        })
        .onOk(() => {
          this.$q.loading.show()
        })
        .onOk(() => {
          this.loadingAdminButton = true
          const user = {
            name: this.usuario.name,
            username: this.usuario.username,
            birthday: this.usuario.birthday,
            email: this.usuario.email,
            cpf: this.usuario.cpf,
            confirmed: this.usuario.confirmed,
            active: this.usuario.active,
            role: 1
          }
          this.$axios.put('users/edit/' + this.usuario.id, user)
            .then(res => {
              if (res.data.success) {
                this.$q.notify({
                  message: res.data.message,
                  color: 'green',
                  position: 'top-right'
                })
                this.$emit('repaginate')
                this.getFicha()
              }
            })
            .catch((err) => {
              this.$q.notify({
                message: err.response.data.message,
                color: 'red',
                position: 'top-right'
              })
            })
            .finally(() => {
              this.loadingAdminButton = false
              this.closeModal()
            })
        })
        .onCancel(() => {
          this.$q.loading.hide()
        })
        .onDismiss(() => {
          this.$q.loading.hide()
        })
    },
    resetarSenha () {
      this.$q
        .dialog({
          title: this.usuario.name,
          message:
            'Tem certeza que deseja retomar a senha padrão ao usuário?',
          cancel: 'Cancelar',
          persistent: true
        })
        .onOk(() => {
          this.$q.loading.show()
        })
        .onOk(() => {
          this.loadingAdminButton = true
          this.$axios.post('/users/reset/' + this.usuario.id, {})
            .then(res => {
              if (res.data.success) {
                this.$q.notify({
                  message: res.data.message,
                  color: 'green',
                  position: 'top-right'
                })
                this.$emit('repaginate')
                this.getFicha()
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
              this.loadingAdminButton = false
              this.closeModal()
            })
        })
        .onCancel(() => {
          this.$q.loading.hide()
        })
        .onDismiss(() => {
          this.$q.loading.hide()
        })
    },
    getFicha () {
      this.loadingUser = true
      this.$axios.get('/patients/' + this.patientId)
        .then(res => {
          if (res.data.success) {
            this.usuario = res.data.user
          }
        })
        .finally(() => {
          this.loadingUser = false
        })
    },
    sigla (user) {
      const nome = String(user)
      const nomeArray = nome.split(' ')

      return nomeArray[0][0] + nomeArray[nomeArray.length - 1][0]
    },
    closeModal () {
      this.$emit('closeModal')
      this.usuario = null
      this.$store.commit('fichas/setSelectedUserId', null)
    }
  },
  computed: {
    OpenModalUser: {
      get () {
        return this.OpenModal
      }
    },
    patientId: {
      get () {
        return this.$store.getters['fichas/getSelectedUserId']
      },
      set (value) {
        this.$store.commit('fichas/setSelectedUserId', value)
      }
    }
  },
  mounted () {
    this.getFicha()
  }
}
</script>

<style lang='scss' scoped>

</style>
