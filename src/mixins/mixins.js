import Vue from 'vue'

Vue.mixin({
  data () {
    return {
      agendaLocale: 'pt-br',
      agendaOptionInterval: [
        {
          label: 'Dia',
          value: 'day'
        },
        {
          label: 'Semana',
          value: 'week'
        }
        // {
        //   label: 'Mês',
        //   value: 'month'
        // }
      ],
      agendaIntervalStart: 26,
      agendaIntervalMinutes: 15,
      agendaIntervalCount: 48,
      agendaIntervalheight: 25,
      agendaDayDuration: 720,
      agendaTimeLimit: '18:30',
      agendaTimeStart: '6:30'
    }
  }
})
