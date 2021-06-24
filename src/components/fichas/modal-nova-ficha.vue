<template>
  <q-dialog v-model="OpenModalFicha" persistent>
    <q-card style="width: 400px">
      <q-card-section class="row items-center">
        <div class="text-h6">Criar Ficha</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="closeModal()" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="q-pt-none">
          <div class="q-col-gutter-md row">
            <div class="col-12">
              <q-input dense outlined v-model="paciente.name" label="Nome" />
            </div>
            <div class="col-6">
              <q-input dense outlined v-model="paciente.cpf" label="CPF" mask="###.###.###-##" />
            </div>
            <div class="col-6">
              <q-input dense outlined v-model="paciente.telefone" label="Telefone" v-mask="['(##)####-####', '(##)#####-####']" />
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
            :loading="loadingSaving"
            @click="saveFicha"
            dense
            outline
            color="positive"
            label="Salvar"
          >
            <template v-slot:loading>
              <q-spinner color="primary" size=".8em" />
            </template>
          </q-btn>
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mask } from 'vue-the-mask'

export default {
  name: 'modalNewForm',
  props: {
    OpenModal: {
      type: Boolean,
      default: false
    }
  },
  directives: { mask },
  data: () => ({
    loadingSaving: false,
    paciente: {
      name: '',
      telefone: '',
      cpf: '',
      externalFile: ''
    }
  }),
  methods: {
    saveFicha () {
      this.loadingSaving = true
      const ficha = {
        name: this.paciente.name,
        telefone: this.paciente.telefone,
        cpf: this.paciente.cpf,
        externalFile: this.paciente.externalFile
      }
      this.$axios.post('patients', ficha)
        .then(res => {
          if (res.data.success) {
            this.$q.notify({
              message: res.data.message,
              color: 'green',
              position: 'top-right'
            })
            this.$emit('repaginate')
            this.$emit('openModalCreatedFicha', res.data.data.id)
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
    closeModal () {
      this.$emit('closeModal')
      this.paciente = null
    }
  },
  computed: {
    OpenModalFicha: {
      get () {
        return this.OpenModal
      }
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
