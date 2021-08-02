<template>
  <div class="q-col-gutter-md row q-ma-xs">
    <div class="col-12">
      <q-card>
        <q-toolbar class="q-pl-md">
          <q-toolbar-title class="text-h6 text-weight-regular">
            Agenda de Consultas - Doutora Luciene Yamashiro
          </q-toolbar-title>
          <q-space />
          <div class="q-gutter-sm row items-center">
            <q-btn color="accent" dense round icon="navigate_before" @click="calendarPrev" />
            <q-input outlined @click.stop="openModalSelect" dense v-model="inputDate" label="Data">
              <template v-slot:prepend>
                <q-icon @click.stop="openModalSelect" name="event" />
              </template>
            </q-input>
            <q-btn color="accent" dense round icon="navigate_next" @click="calendarNext" />
          </div>
        </q-toolbar>
        <q-calendar
          v-model="selectedDate"
          class="calendar-container"
          :style="style"
          color="primary"
          ref="calendar"
          hour24-format
          :disabled-weekdays="[0]"
          :view="interval"
          :locale="agendaLocale"
          :interval-start="agendaIntervalStart"
          :interval-minutes="agendaIntervalMinutes"
          :interval-count="agendaIntervalCount"
          :interval-height="agendaIntervalheight"
        >
          <template #day-header="{ timestamp }">
            <div v-if="verifyToday(timestamp.date)" class="row justify-center">
              <q-badge
                style="width: 100%; cursor: pointer;"
                color="secondary"
              >
              </q-badge>
            </div>
          </template>
          <template #day-body="{ timestamp, timeStartPos, timeDurationHeight }">
            <template v-for="(event, index) in showEvents(timestamp.date)">
              <q-badge
                v-if="event.time"
                :key="index"
                class="my-event justify-center"
                :class="badgeClasses(event, 'body')"
                :style="badgeStyles(event, 'body', timeStartPos, timeDurationHeight)"
              >
                <span class="ellipsis">{{ event.title }}</span>
              </q-badge>
            </template>
          </template>
        </q-calendar>
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
import QCalendar from '@quasar/quasar-ui-qcalendar'
import { mapGetters } from 'vuex'

const CURRENT_DAY = new Date()

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
    style: {
      '--calendar-border': '#047076 1px solid',
      '--calendar-border-section': '#10564F 1px dashed',
      '--calendar-border-current': '#047076 2px solid',
      '--calendar-color': '#10564F',
      '--calendar-disabled-date-color': '#047076',
      '--calendar-disabled-date-background': '#bbbcbd',
      '--calendar-active-date-color': '#1D1D1D',
      '--calendar-active-date-background': '#93daca'
    },
    selectedDate: '',
    OpenModalSelectDate: false,
    interval: 'week',
    loading: false
  }),
  computed: {
    ...mapGetters('agenda', ['getEvents']),
    eventsMap () {
      const map = {}
      this.events.forEach((event) => (map[event.date] = map[event.date] || []).push(event))
      return map
    },
    inputDate: {
      get () {
        const date = new Date(`${this.selectedDate} 12:00`)
        return `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}/${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}/${date.getFullYear()}`
      },
      set (value) {
        this.selectedDate = value
      }
    }
  },
  methods: {
    async calendarNext () {
      await this.$refs.calendar.next()
      this.listEvents()
    },
    async calendarPrev () {
      await this.$refs.calendar.prev()
      this.listEvents()
    },
    openModalSelect () {
      this.OpenModalSelectDate = true
      this.$store.commit('agenda/setSelectedDate', this.selectedDate)
    },
    verifyToday (timestamp) {
      const newDay = new Date(CURRENT_DAY)
      const tm = QCalendar.parseDate(newDay)
      if (timestamp === tm.date) {
        return true
      } else {
        return false
      }
    },
    badgeClasses (event, type) {
      const cssColor = this.isCssColor(event.bgcolor)
      return {
        [`text-white bg-${event.bgcolor}`]: !cssColor,
        'full-width': true
      }
    },
    isCssColor (color) {
      return !!color && !!color.match(/^(#|(rgb|hsl)a?\()/)
    },
    badgeStyles (event, type, timeStartPos, timeDurationHeight) {
      const s = {}
      if (timeStartPos) {
        s.top = timeStartPos(event.time) + 'px'
      }
      if (timeDurationHeight) {
        s.height = timeDurationHeight(event.duration) + 'px'
      }
      s['border-radius'] = '0px !important'
      s['align-items'] = 'flex-start'
      return s
    },
    listEvents () {
      const parsedStartDate = this.$refs.calendar.lastStart
      const parsedEndDate = this.$refs.calendar.lastEnd
      this.$q.loading.show()
      this.$axios.get('appointments/limited?init=' + parsedStartDate + '&final=' + parsedEndDate)
        .then((res) => {
          if (res.data.success) {
            this.$store.commit('agenda/setEvents', res.data.data)
          }
        }).finally(() => {
          this.$q.loading.hide()
        })
    },
    showEvents (dt) {
      const events = []
      for (let i = 0; i < this.getEvents.length; ++i) {
        if (this.getEvents[i].date === dt) {
          events.push(this.getEvents[i])
        }
      }
      return events
    }
  },
  mounted () {
    const date = new Date()
    this.selectedDate = `${date.getFullYear()}-${
        date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString()
      }-${
        date.getDate() < 10 ? '0' + (date.getDate()).toString() : (date.getDate()).toString()
      }`
    this.listEvents()
  }
}
</script>

<style lang="sass">
.calendar-container
  position: relative

.my-event
  width: 100%
  position: absolute
  font-size: 12px

.full-width
  left: 0
  width: 100%
</style>
