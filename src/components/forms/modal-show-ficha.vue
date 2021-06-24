<template>
  <q-dialog v-model="OpenModalFicha" persistent>
    <q-card style="width: 400px">
      <q-card-section class="row items-center">
        <div class="text-h6">Editar Ficha</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="closeModal()" />
      </q-card-section>

      <q-card-section class="q-pt-none" v-if="paciente">
        <div class="q-pt-none">
          <div class="q-col-gutter-md row">
            <div class="col-12">
              <q-input dense outlined v-model="paciente.name" label="Nome" />
            </div>
            <div class="col-6">
              <q-input dense outlined v-model="paciente.cpf" label="CPF" mask="###.###.###-##" />
            </div>
            <div class="col-6">
              <q-input dense outlined v-model="paciente.phone" label="Telefone" v-mask="['(##)####-####', '(##)#####-####']" />
            </div>
            <div class="col-12">
              <q-input dense outlined v-model="paciente.externalFile" label="Pasta" />
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions v-if="paciente" align="right">
        <div class="q-ma-sm q-gutter-xs">
          <q-btn
            no-caps
            :loading="loadingMorto"
            @click="arquivoMorto(paciente.active)"
            dense
            outline
            :color="paciente.active ? 'negative' : 'warning'"
            :label="paciente.active ? 'Editar e desativar' : 'Editar e reativar'"
          >
            <template v-slot:loading>
              <q-spinner color="primary" size=".8em" />
            </template>
          </q-btn>
          <q-btn
            no-caps
            :loading="loadingSaving"
            @click="editFicha"
            dense
            outline
            color="positive"
            label="Editar"
          >
            <template v-slot:loading>
              <q-spinner color="primary" size=".8em" />
            </template>
          </q-btn>
        </div>
      </q-card-actions>

      <q-card-section v-else style="height: 300px">

      </q-card-section>
      <q-inner-loading :showing="loadingFicha">
        <q-spinner color="primary" size="3em" />
        <p class="q-mt-md">Trazendo informações do usuário...</p>
      </q-inner-loading>
    </q-card>
  </q-dialog>
</template>

<script>
import { mask } from 'vue-the-mask'

export default {
  name: 'modalShowUser',
  props: {
    OpenModal: {
      type: Boolean,
      default: false
    }
  },
  directives: { mask },
  data: () => ({
    loadingFicha: false,
    loadingSaving: false,
    loadingMorto: false,
    paciente: null
  }),
  methods: {
    editFicha () {
      this.loadingSaving = true
      const ficha = {
        name: this.paciente.name,
        phone: this.paciente.phone,
        cpf: this.paciente.cpf,
        externalFile: this.paciente.externalFile
      }
      this.$axios.put('patients/' + this.paciente.id, ficha)
        .then(res => {
          if (res.data.success) {
            this.$q.notify({
              message: res.data.message,
              color: 'green',
              position: 'top-right'
            })
            this.$emit('repaginate')
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
          this.loadingSaving = false
          this.closeModal()
        })
    },
    arquivoMorto (active) {
      this.$q
        .dialog({
          title: this.paciente.name,
          message:
            active
              ? 'Tem certeza que deseja mandar esta ficha ao Arquivo Morto?'
              : 'Tem certeza que deseja reativar esta ficha?',
          cancel: 'Cancelar',
          persistent: true
        })
        .onOk(() => {
          this.$q.loading.show()
        })
        .onOk(() => {
          this.loadingMorto = true
          const ficha = {
            name: this.paciente.name,
            phone: this.paciente.phone,
            cpf: this.paciente.cpf,
            externalFile: this.paciente.externalFile,
            active: !active
          }
          this.$axios.put('patients/' + this.paciente.id, ficha)
            .then(res => {
              if (res.data.success) {
                this.$q.notify({
                  message: res.data.message,
                  color: 'green',
                  position: 'top-right'
                })
                this.$emit('repaginate')
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
              this.loadingMorto = false
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
      this.loadingFicha = true
      this.$axios.get('/patients/' + this.patientId)
        .then(res => {
          if (res.data.success) {
            this.paciente = res.data.user
          }
        })
        .finally(() => {
          this.loadingFicha = false
        })
    },
    closeModal () {
      this.$emit('closeModal')
      this.paciente = null
      this.$store.commit('forms/setSelectedUserId', null)
    }
  },
  computed: {
    OpenModalFicha: {
      get () {
        return this.OpenModal
      }
    },
    patientId: {
      get () {
        return this.$store.getters['forms/getSelectedUserId']
      },
      set (value) {
        this.$store.commit('forms/setSelectedUserId', value)
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
