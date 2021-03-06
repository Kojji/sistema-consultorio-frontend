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
                <q-icon @click.stop="openModalSelect" name="event" />
              </template>
            </q-input>
            <q-btn color="accent" dense round icon="navigate_before" @click="calendarPrev" />
            <q-select
              outlined
              dense
              map-options
              emit-value
              v-model="interval"
              :options="agendaOptionInterval"
            />
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
          @click:interval2="addEventMenu"
          @click:time2="addEventMenu"
          @click:day2="addEventMenu"
          @click:week2="addEventMenu"
        >
          <template #day="{ timestamp }">
            <template v-for="(event, index) in showEvents(timestamp.date)">
              <q-badge
                :key="index"
                style="width: 100%; cursor: pointer; height: 16px; max-height: 16px"
                :class="badgeClasses(event, 'day')"
                :style="badgeStyles(event, 'day')"
              >
                <span class="ellipsis">{{ event.title }}</span>
              </q-badge>
            </template>
          </template>
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
                @click.stop="openEditEvent(event)"
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
      <modalEventForm
        v-if="OpenModalEventForm"
        :OpenModal="OpenModalEventForm"
        :newEvent="isNewEvent"
        v-on:closeModal="OpenModalEventForm = false"
        v-on:repaginate="listEvents()"
      />
    </div>
  </div>
</template>

<script>
import QCalendar from '@quasar/quasar-ui-qcalendar'
import { mapGetters } from 'vuex'

const CURRENT_DAY = new Date()

const reRGBA = /^\s*rgb(a)?\s*\((\s*(\d+)\s*,\s*?){2}(\d+)\s*,?\s*([01]?\.?\d*?)?\s*\)\s*$/

function textToRgb (color) {
  if (typeof color !== 'string') {
    throw new TypeError('Expected a string')
  }

  const m = reRGBA.exec(color)
  if (m) {
    const rgb = {
      r: Math.min(255, parseInt(m[2], 10)),
      g: Math.min(255, parseInt(m[3], 10)),
      b: Math.min(255, parseInt(m[4], 10))
    }
    if (m[1]) {
      rgb.a = Math.min(1, parseFloat(m[5]))
    }
    return rgb
  }
  return hexToRgb(color)
}

function hexToRgb (hex) {
  if (typeof hex !== 'string') {
    throw new TypeError('Expected a string')
  }

  hex = hex.replace(/^#/, '')

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  } else if (hex.length === 4) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
  }

  const num = parseInt(hex, 16)

  return hex.length > 6
    ? { r: num >> 24 & 255, g: num >> 16 & 255, b: num >> 8 & 255, a: Math.round((num & 255) / 2.55) }
    : { r: num >> 16, g: num >> 8 & 255, b: num & 255 }
}

function luminosity (color) {
  if (typeof color !== 'string' && (!color || color.r === undefined)) {
    throw new TypeError('Expected a string or a {r, g, b} object as color')
  }

  const
    rgb = typeof color === 'string' ? textToRgb(color) : color,
    r = rgb.r / 255,
    g = rgb.g / 255,
    b = rgb.b / 255,
    R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4),
    G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4),
    B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

export default {
  name: 'Agenda',
  meta: {
    title: 'Cadastra-Re',
    titleTemplate: title => `${title} - Agenda de consultas`
  },
  components: {
    modalSelectDate: () => import('src/components/agenda/modal-select-date.vue'),
    modalEventForm: () => import('src/components/agenda/modal-event-form.vue')
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
    OpenModalEventForm: false,
    isNewEvent: true,
    interval: 'week',
    pagination: {
      itemsPerPage: 35,
      page: 0
    }
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
    openEditEvent (event) {
      this.isNewEvent = false
      this.OpenModalEventForm = true
      this.$store.commit('agenda/setEditEvent', event)
    },
    addEventMenu ({ scope, event }) {
      this.isNewEvent = true
      this.OpenModalEventForm = true
      this.$store.commit('agenda/setEditScope', scope)
    },
    badgeClasses (event, type) {
      const cssColor = this.isCssColor(event.bgcolor)
      const isHeader = type === 'header'
      return {
        [`text-white bg-${event.bgcolor}`]: !cssColor,
        'full-width': !isHeader && (!event.side || event.side === 'full'),
        'left-side': !isHeader && event.side === 'left',
        'right-side': !isHeader && event.side === 'right'
      }
    },
    isCssColor (color) {
      return !!color && !!color.match(/^(#|(rgb|hsl)a?\()/)
    },
    badgeStyles (event, type, timeStartPos, timeDurationHeight) {
      const s = {}
      if (this.isCssColor(event.bgcolor)) {
        s['background-color'] = event.bgcolor
        s.color = luminosity(event.bgcolor) > 0.5 ? 'black' : 'white'
      }
      if (type !== 'day') {
        s['border-style'] = 'solid'
        s['border-color'] = 'black'
      }
      if (timeStartPos) {
        s.top = timeStartPos(event.time) + 'px'
      }
      if (timeDurationHeight) {
        s.height = timeDurationHeight(event.duration) + 'px'
      }
      s['align-items'] = 'flex-start'
      return s
    },
    listEvents () {
      const parsedStartDate = this.$refs.calendar.lastStart
      const parsedEndDate = this.$refs.calendar.lastEnd
      this.$q.loading.show()
      this.$axios.get('appointments?init=' + parsedStartDate + '&final=' + parsedEndDate)
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
        let added = false
        if (this.getEvents[i].date === dt) {
          if (this.getEvents[i].time) {
            if (events.length > 0) {
              const startTime = QCalendar.parsed(this.getEvents[i].date + ' ' + this.getEvents[i].time)
              const endTime = QCalendar.addToDate(startTime, { minute: this.getEvents[i].duration })
              for (let j = 0; j < events.length; ++j) {
                if (events[j].time) {
                  const startTimeOriginal = QCalendar.parsed(events[j].date + ' ' + events[j].time)
                  const startTime2 = QCalendar.addToDate(startTimeOriginal, { minute: 1 })
                  const endTime2 = QCalendar.addToDate(startTimeOriginal, { minute: events[j].duration - 1 })

                  if (QCalendar.isBetweenDates(startTime, startTime2, endTime2, true) || QCalendar.isBetweenDates(endTime, startTime2, endTime2, true)) {
                    events[j].side = 'left'
                    this.getEvents[i].side = 'right'
                    events.push(this.getEvents[i])
                    added = true
                    break
                  }
                }
              }
            }
          }
          if (!added) {
            this.getEvents[i].side = undefined
            events.push(this.getEvents[i])
          }
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

.left-side
  left: 0
  width: 49.75%

.right-side
  left: 50.25%
  width: 49.75%
</style>
