<template>
  <div class="q-col-gutter-md row q-ma-xs">
    <div class="col-12">
      <q-card>
        <q-toolbar class="q-pl-md">
          <q-toolbar-title class="text-h6 text-weight-regular">
            Agenda de Consultas
          </q-toolbar-title>
          <q-space />
          <div class="q-gutter-sm row items-center">
            <q-input outlined @click.stop="openModalSelect" dense v-model="inputDate" label="Data">
              <template v-slot:prepend>
                <q-icon name="event" />
              </template>
            </q-input>
            <q-btn color="accent" dense round icon="navigate_before" @click="calendarPrev" />
            <q-select
              outlined
              dense
              map-options
              emit-value
              v-model="interval"
              :options="optionsInterval"
            />
            <q-btn color="accent" dense round icon="navigate_next" @click="calendarNext" />
          </div>
        </q-toolbar>
        <q-calendar
          v-model="selectedDate"
          ref="calendar"
          :view="interval"
          locale="pt-br"
          :interval-start="24"
          :interval-minutes="15"
          :interval-count="52"
          :interval-height="25"
        />
      </q-card>
      <modalSelectDate
        v-if="OpenModalSelectDate"
        :OpenModal="OpenModalSelectDate"
        :selectedDate="selectedDate"
        v-on:closeModal="OpenModalSelectDate = false"
        v-on:newDateSelected="date => selectedDate = date"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Agenda',
  meta: {
    title: 'Cadastra-Re',
    titleTemplate: title => `${title} - Agenda de consultas`
  },
  components: {
    modalSelectDate: () => import('src/components/agenda/modal-select-date.vue')
  },
  data: () => ({
    selectedDate: '',
    OpenModalSelectDate: false,
    interval: 'week',
    optionsInterval: [
      {
        label: 'Dia',
        value: 'day'
      },
      {
        label: 'Semana',
        value: 'week'
      },
      {
        label: 'Mês',
        value: 'month'
      }
    ]
  }),
  computed: {
    inputDate: {
      get () {
        const date = new Date(`${this.selectedDate} 12:00`)
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
      },
      set (value) {
        this.selectedDate = value
      }
    }
  },
  methods: {
    calendarNext () {
      this.$refs.calendar.next()
    },
    calendarPrev () {
      this.$refs.calendar.prev()
    },
    openModalSelect () {
      this.OpenModalSelectDate = true
      this.$store.commit('agenda/setSelectedDate', this.selectedDate)
    }
  },
  mounted () {
    const date = new Date()
    this.selectedDate = `${date.getFullYear() + 1}-${
        date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString()
      }-${
        date.getDate() < 10 ? '0' + (date.getDate()).toString() : (date.getDate()).toString()
      }`
  }
}
</script>
