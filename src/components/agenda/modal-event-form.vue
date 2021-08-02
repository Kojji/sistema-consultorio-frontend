<template>
  <q-dialog v-model="OpenModalEdit" persistent>
    <div>
      <q-form
        ref='event'
        @submit="onSubmit"
      >
        <q-card v-if="OpenModalEdit" style="width: 400px;">
          <q-toolbar class="bg-primary text-white">
            <q-toolbar-title>
              {{isNewEvent ? 'Novo' : 'Editar'}} Evento
            </q-toolbar-title>
            <q-btn flat round color="white" icon="close" @click="closeModal"></q-btn>
          </q-toolbar>
          <q-card-section class="inset-shadow">
            <q-input
              v-model="eventForm.title"
              label="Titulo"
              :rules="[v => v && v.length > 0 || 'Campo obrigatório']"
              autofocus
            />
            <q-input
              v-model="eventForm.details"
              autogrow
              label="Detalhes"
            />
            <!-- <q-select
              v-model="search"
              use-input
              @filter="filterFn"
              input-debounce="0"
              clearable
              behavior="dialog"
              map-options
              option-value="id"
              option-label="name"
              emit-value
              @update="changeTitle"
              :options="pacientes"
              label="Paciente"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Nenhum paciente encontrado!
                  </q-item-section>
                </q-item>
              </template>
            </q-select> -->
            <q-input
              v-model="inputDate"
              label="Data"
              disable
            />
            <q-checkbox
              v-model="eventForm.allDay"
              label="Usar dia inteiro?"
              class="q-my-sm"
            />

            <div v-if="!eventForm.allDay" class="row q-gutter-xs">
              <q-input
                class="col"
                v-model="eventForm.dateTimeStart"
                ref="dateTimeStart"
                label="Início"
                :rules="[
                  val => checkDateTimeDiff() || 'Hora de Início maior que a de Término',
                  val => checkDateTimeStart() || 'Hora de Início Inválida',
                ]"
                outlined
                color="blue-6"
              >
              </q-input>

              <q-input
                class="col"
                v-model="eventForm.dateTimeEnd"
                ref="dateTimeEnd"
                label="Término"
                :rules="[
                  val => checkDateTimeDiff() || 'Hora de Início maior que a de Término',
                  val => checkDateTimeEnd() || 'Hora de Término Inválida',
                ]"
                color="blue-6"
                outlined
              >
              </q-input>
            </div>

            <q-input
              v-model="eventForm.bgcolor"
              label="Cor"
              outlined
              :rules="[v => v && v.length > 0 || 'Campo obrigatório']"
            >
              <template #prepend>
                <q-icon name="format_color_fill" :style="setColor()" class="cursor-pointer">
                </q-icon>
              </template>
              <template #append>
                <q-icon name="colorize" class="cursor-pointer">
                  <q-popup-proxy>
                    <q-color
                      v-model="eventForm.bgcolor"
                      no-header
                      no-footer
                      default-view="palette"
                    ></q-color>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Excluir" v-if="!newEvent" color="negative" @click="deleteEvent"></q-btn>
            <q-btn flat label="Fechar" type="reset" color="primary" @click="closeModal"></q-btn>
            <q-btn flat label="Salvar" type="submit" color="primary"></q-btn>
          </q-card-actions>
        </q-card>
      </q-form>
    </div>
  </q-dialog>
</template>

<script>
import QCalendar from '@quasar/quasar-ui-qcalendar'
const formDefault = {
  title: '',
  details: '',
  allDay: false,
  date: '',
  patientId: null,
  dateTimeStart: '',
  dateTimeEnd: '',
  bgcolor: '#66b3ff'
}
export default {
  props: {
    OpenModal: {
      type: Boolean,
      default: false
    },
    newEvent: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    eventForm: { ...formDefault },
    contextDay: null,
    locale: 'pt-br',
    showDateTimeScrollerStart: false,
    showDateTimeScrollerEnd: false,
    showDateScrollerAllDay: false,
    appointmentId: null,
    pacientes: [],
    search: null,
    loadingSearch: false
  }),
  computed: {
    OpenModalEdit: {
      get () {
        return this.OpenModal
      }
    },
    isNewEvent: {
      get () {
        return this.newEvent
      }
    },
    inputDate: {
      get () {
        const date = new Date(`${this.eventForm.date} 12:00`)
        return `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}/${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}/${date.getFullYear()}`
      }
    }
  },
  methods: {
    closeModal () {
      this.$emit('closeModal')
    },
    changeTitle () {
      console.log(this.search)
    },
    setColor () {
      return `color: ${this.eventForm.bgcolor}`
    },
    resetForm () {
      this.$set(this, 'eventForm', { ...formDefault })
    },
    getForms (val) {
      this.loadingSearch = true
      this.$axios.get('/patients/name', {
        params: {
          page: 1,
          active: true,
          search: val
        }
      })
        .then((res) => {
          if (res.data.success) {
            this.pacientes = res.data.patients
          }
        })
        .finally(() => {
          this.loadingSearch = false
        })
    },
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.pacientes = []
        })
        return
      }

      update(async () => {
        return await this.getForms(val)
      })
    },
    adjustTimestamp (day) {
      if (day.minute < 15) day.minute = 0
      else if (day.minute < 30) day.minute = 15
      else if (day.minute < 45) day.minute = 30
      else day.minute = 45
      day.time = QCalendar.getTime(day)
      return day
    },
    checkDateTimeDiff () {
      this.$refs.dateTimeStart.resetValidation()
      this.$refs.dateTimeEnd.resetValidation()
      if (this.eventForm.dateTimeStart && this.eventForm.dateTimeEnd) {
        const timestampStart = QCalendar.parseTimestamp(this.eventForm.date + ' ' + this.eventForm.dateTimeStart)
        const timestampEnd = QCalendar.parseTimestamp(this.eventForm.date + ' ' + this.eventForm.dateTimeEnd)
        const diffMilliseconds = QCalendar.diffTimestamp(timestampStart, timestampEnd, true)
        if (diffMilliseconds === 0) {
          return false
        } else {
          return true
        }
      }
      return false
    },
    checkDateTimeEnd (val) {
      if (this.eventForm.dateTimeEnd) {
        const timestampEnd = QCalendar.parseTimestamp(this.eventForm.date + ' ' + this.eventForm.dateTimeEnd)
        const timestampLimit = QCalendar.parseTimestamp(this.eventForm.date + ' ' + this.agendaTimeLimit)
        const diffMilliseconds = QCalendar.diffTimestamp(timestampEnd, timestampLimit, false)
        if (diffMilliseconds < 0) {
          return false
        } else {
          return true
        }
      }
      return false
    },
    checkDateTimeStart (/* val */) {
      if (this.eventForm.dateTimeStart) {
        const timestampLimit = QCalendar.parseTimestamp(this.eventForm.date + ' ' + this.agendaTimeStart)
        const timestampStart = QCalendar.parseTimestamp(this.eventForm.date + ' ' + this.eventForm.dateTimeStart)
        const diffMilliseconds = QCalendar.diffTimestamp(timestampLimit, timestampStart, false)
        if (diffMilliseconds < 0) {
          return false
        } else {
          return true
        }
      }
      return false
    },
    deleteEvent () {
      const selectedEvent = this.$store.getters['agenda/getEditEvent']
      const toSubmit = {
        active: false,
        title: selectedEvent.title,
        details: selectedEvent.details,
        PatientId: selectedEvent.PatientId,
        bgcolor: selectedEvent.bgcolor,
        duration: selectedEvent.duration,
        date: selectedEvent.date,
        time: selectedEvent.time
      }

      this.$axios.put('appointments/appointment/' + this.appointmentId, toSubmit)
        .then((res) => {
          this.$q.notify({
            message: res.data.message,
            color: 'green',
            position: 'top-right'
          })
          this.$emit('repaginate')
          this.closeModal()
        })
    },
    onSubmit () {
      const toSubmit = {}
      toSubmit.title = this.eventForm.title
      toSubmit.details = this.eventForm.details
      toSubmit.PatientId = this.search
      toSubmit.date = this.eventForm.date
      toSubmit.bgcolor = this.eventForm.bgcolor
      toSubmit.active = true
      if (this.eventForm.allDay) {
        toSubmit.time = this.agendaTimeStart
        toSubmit.duration = this.agendaDayDuration
      } else {
        toSubmit.time = this.eventForm.dateTimeStart
        const timestampEnd = QCalendar.parseTimestamp(this.eventForm.date + ' ' + this.eventForm.dateTimeEnd)
        const timestampStart = QCalendar.parseTimestamp(this.eventForm.date + ' ' + this.eventForm.dateTimeStart)
        const diffMilliseconds = QCalendar.diffTimestamp(timestampStart, timestampEnd, false)
        toSubmit.duration = diffMilliseconds / 60000
      }

      if (this.newEvent) {
        this.$axios.post('appointments', toSubmit)
          .then((res) => {
            this.$q.notify({
              message: res.data.message,
              color: 'green',
              position: 'top-right'
            })
            this.$emit('repaginate')
            this.closeModal()
          })
      } else {
        this.$axios.put('appointments/appointment/' + this.appointmentId, toSubmit)
          .then((res) => {
            this.$q.notify({
              message: res.data.message,
              color: 'green',
              position: 'top-right'
            })
            this.$emit('repaginate')
            this.closeModal()
          })
      }
    }
  },
  mounted () {
    this.resetForm()
    if (this.newEvent) {
      const scope = this.$store.getters['agenda/getEditScope']
      this.contextDay = { ...scope.timestamp }
      this.eventForm.date = this.contextDay.date
      const timestamp = this.adjustTimestamp(this.contextDay)
      const endTime = QCalendar.addToDate(timestamp, { hour: 1 })
      this.eventForm.dateTimeEnd = QCalendar.getTime(endTime)
      this.eventForm.dateTimeStart = QCalendar.getTime(timestamp)
      this.eventForm.allDay = false
      this.eventForm.PacientId = null
      this.eventForm.bgcolor = '#66b3ff' // starting color
    } else {
      const selectedEvent = this.$store.getters['agenda/getEditEvent']
      this.appointmentId = selectedEvent.id
      this.eventForm.date = selectedEvent.date
      this.eventForm.title = selectedEvent.title
      this.eventForm.details = selectedEvent.details
      const date = QCalendar.parsed(selectedEvent.date + ' ' + selectedEvent.time)
      const endTime = QCalendar.addToDate(date, { minute: selectedEvent.duration })
      this.eventForm.dateTimeEnd = QCalendar.getTime(endTime)
      this.eventForm.dateTimeStart = selectedEvent.time
      this.eventForm.PatientId = selectedEvent.PatientId
      this.eventForm.allDay = selectedEvent.duration === this.agendaDayDuration
      this.eventForm.bgcolor = selectedEvent.bgcolor
    }
  }
}
</script>
