<template>
  <q-dialog v-model="OpenModalFicha" persistent>
    <q-card style="width: 600px">
      <q-card-section class="row items-center">
        <div class="text-h6">Criar Ficha</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="closeModal()" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="q-pt-none">
          <div class="q-col-gutter-sm row">
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
            <div class="col-12 q-gutter-sm" align="center">
              <q-radio v-model="paciente.active" :val="true" label="Arquivo Ativo" />
              <q-radio v-model="paciente.active" :val="false" label="Arquivo Morto" />
            </div>
            <div class="col-12 q-gutter-sm q-py-none" align="center">
              <q-checkbox v-model="paciente.emitReceipt" label="Emitir Nota" />
            </div>
            <div v-if="paciente.emitReceipt" class="q-col-gutter-sm row">
              <div class="col-12">
                <q-input dense outlined v-model="paciente.email" label="Email" />
              </div>
              <div class="col-4">
                <q-input dense outlined v-model="paciente.postalCode" label="CEP" mask="#####-###">
                  <template v-if="paciente.postalCode" v-slot:append>
                    <q-btn
                      :loading="loadingCEP"
                      :disable="loadingCEP"
                      name="search"
                      clickable
                      @click.stop="procuraCEP(paciente.postalCode)"
                      icon="search"
                      outline
                      dense
                      class="cursor-pointer"
                      color="positive"
                    >
                      <template v-slot:loading>
                        <q-spinner color="white" size=".8em" />
                      </template>
                    </q-btn>
                  </template>
                </q-input>
              </div>
              <div class="col-4">
                <q-input dense outlined v-model="paciente.state" label="Estado" />
              </div>
              <div class="col-4">
                <q-input dense outlined v-model="paciente.city" label="Cidade" />
              </div>
              <div class="col-6">
                <q-input dense outlined v-model="paciente.block" label="Bairro" />
              </div>
              <div class="col-6">
                <q-input dense outlined v-model="paciente.street" label="Rua" />
              </div>
              <div class="col-4">
                <q-input dense ref="cnumero" outlined v-model="paciente.number" label="Número" />
              </div>
              <div class="col-4">
                <q-input dense outlined v-model="paciente.extra" label="Complemento" />
              </div>
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
            label="Criar"
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
    loadingCEP: false,
    paciente: {
      name: '',
      phone: '',
      cpf: '',
      externalFile: '',
      postalCode: '',
      state: '',
      city: '',
      block: '',
      street: '',
      number: null,
      extra: '',
      email: '',
      emitReceipt: false,
      active: true
    }
  }),
  methods: {
    saveFicha () {
      this.loadingSaving = true
      const ficha = {
        name: this.paciente.name,
        phone: this.paciente.phone,
        cpf: this.paciente.cpf,
        externalFile: this.paciente.externalFile,
        postalCode: this.paciente.postalCode,
        state: this.paciente.state,
        city: this.paciente.city,
        block: this.paciente.block,
        street: this.paciente.street,
        number: this.paciente.number,
        extra: this.paciente.extra,
        email: this.paciente.email,
        emitReceipt: this.paciente.emitReceipt,
        active: this.paciente.active
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
    procuraCEP (value) {
      this.loadingCEP = true
      this.$axios.get('/utils/postalCode/' + value)
        .then(res => {
          if (res.data.success) {
            this.$q.notify({
              message: res.data.message,
              color: 'green',
              position: 'top-right'
            })
            this.paciente.state = res.data.data.uf
            this.paciente.city = res.data.data.localidade
            this.paciente.block = res.data.data.bairro
            this.paciente.street = res.data.data.logradouro
            this.paciente.extra = res.data.data.complemento
            this.$refs.cnumero.focus()
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
          this.loadingCEP = false
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
