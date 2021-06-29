<template>
  <q-dialog v-model="OpenModalFicha" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <div class="text-h6">Calendário</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="closeModal()" />
      </q-card-section>
      <q-date
        v-model="date"
        mask="YYYY-MM-DD"
        :locale="myLocale"
        minimal
      />
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'modalSelectDate',
  props: {
    OpenModal: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    myLocale: {
      /* starting with Sunday */
      days: 'Domingo_Segunda_Terça_Quarta_Quinta_Sexta_Sábado'.split('_'),
      daysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
      months: 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
      monthsShort: 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dec'.split('_'),
      firstDayOfWeek: 1
    }
  }),
  methods: {
    closeModal () {
      this.$emit('closeModal')
    }
  },
  computed: {
    OpenModalFicha: {
      get () {
        return this.OpenModal
      }
    },
    date: {
      get () {
        return this.$store.getters['agenda/getSelectedDate']
      },
      set (value) {
        this.$store.commit('agenda/setSelectedDate', value)
        this.$emit('newDateSelected', value)
        this.closeModal()
      }
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
