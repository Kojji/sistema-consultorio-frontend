<template>
  <div class="q-col-gutter-md row q-ma-xs">
    <div class="col-12">
      <q-table
        title="Fichas de Pacientes"
        :data="forms"
        :columns="columns"
        no-data-label="Nenhuma ficha encontrada"
        :pagination="{
          rowsPerPage: 0
        }"
      >
      <template v-slot:top>
          <div class="q-table__control">
            <div class="q-table__title">
              Fichas de Pacientes
              <p class="text-caption">Mostrando {{forms.length}} de {{pagination.count}} {{pagination.count > 1 ? 'fichas' : 'ficha'}}.</p>
              <p>
                <q-btn
                  class="text-accent q-pr-xs"
                  label="Nova ficha"
                  icon="add"
                  outline
                  @click="OpenModalNewFicha = true"
                  dense
                  no-caps
                  no-wrap
                />
                  <!-- @click="OpenModal = true" -->
              </p>
            </div>
          </div>

          <q-space />
          <q-input outlined v-model="search" @input="searchInput" dense label="Buscar" placeholder="CPF ou Nome" class="q-mr-md">
            <template v-slot:prepend>
              <q-icon name="search"/>
            </template>
          </q-input>
          <q-btn flat no-caps no-wrap :color="filterActive ? 'accent' : 'warning'" :label="label" class="q-ml-md">
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item
                  v-for="(opt, index) in options"
                  :key="'group-option-' + index"
                  clickable
                  v-close-popup
                  :class="{'bg-secondary': label === opt.label}"
                  @click="changeFilter(opt)"
                >
                  <q-item-section>{{opt.label}}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </template>
        <template v-slot:body="props">
          <q-tr @click="openUsuario(props.row.id)" class="cursor-pointer" :props="props">
            <q-td>
              {{ props.row.id }}
            </q-td>
            <q-td>
              {{ props.row.name }}
            </q-td>
            <q-td>
              {{ props.row.externalFile }}
            </q-td>
            <q-td>
              {{ props.row.phone }}
            </q-td>
            <q-td>
              {{ props.row.cpf }}
            </q-td>
            <q-td>
              <q-icon v-if="props.row.emitReceipt" name="done" size="18px" color="positive" />
              <q-icon v-else name="close" size="18px" color="negative" />
            </q-td>
          </q-tr>
        </template>
        <template v-slot:bottom>
          <div />
        </template>
      </q-table>
      <modalShowFicha
        v-if="OpenModalFicha"
        :OpenModal="OpenModalFicha"
        ref="showUsuario"
        v-on:closeModal="OpenModalFicha = false"
        v-on:repaginate="resetPagination(), getForms()"
      />
      <modalCreateFicha
        v-if="OpenModalNewFicha"
        :OpenModal="OpenModalNewFicha"
        v-on:closeModal="OpenModalNewFicha = false"
        v-on:repaginate="resetPagination(), getForms()"
        v-on:openModalCreatedFicha="id => openUsuario(id)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Forms',
  meta: {
    title: 'Cadastra-Re',
    titleTemplate: title => `${title} - Fichas de pacientes`
  },
  components: {
    modalShowFicha: () => import('src/components/forms/modal-show-ficha.vue'),
    modalCreateFicha: () => import('src/components/forms/modal-nova-ficha.vue')
  },
  data: () => ({
    OpenModalFicha: false,
    OpenModalNewFicha: false,
    filterActive: true,
    forms: [],
    search: '',
    columns: [
      {
        name: 'id',
        label: 'ID',
        align: 'left',
        field: row => row.id,
        format: val => `${val}`,
        sortable: true
      },
      {
        name: 'name',
        label: 'Nome',
        align: 'left',
        field: row => row.name,
        format: val => `${val}`,
        sortable: true
      },
      {
        name: 'externalFile',
        label: 'Pasta',
        align: 'left',
        field: row => row.externalFile,
        format: val => `${val}`,
        sortable: false
      },
      {
        name: 'phone',
        label: 'Telefone',
        align: 'left',
        field: row => row.phone,
        format: val => `${val}`,
        sortable: true
      },
      {
        name: 'cpf',
        label: 'CPF',
        align: 'left',
        field: row => row.cpf,
        format: val => `${val}`,
        sortable: true
      },
      {
        name: 'emitReceipt',
        label: 'Nota Fiscal',
        align: 'left',
        field: row => row.emitReceipt,
        format: val => `${val}`,
        sortable: false
      }
    ],
    pagination: {
      count: 0,
      limit: 20,
      nextPage: true,
      offset: 0,
      page: 0
    },
    label: 'Arquivo Ativo',
    options: [
      {
        label: 'Arquivo Ativo',
        value: true
      },
      {
        label: 'Arquivo Morto',
        value: false
      }
    ]
  }),
  computed: {
    userId: {
      get () {
        return this.$store.getters['forms/getSelectedUserId']
      },
      set (value) {
        this.$store.commit('forms/setSelectedUserId', value)
      }
    }
  },
  methods: {
    searchInput () {
      this.resetPagination()
      this.getForms()
    },
    getForms () {
      this.$q.loading.show()
      this.$axios.get('/patients', {
        params: {
          page: ++this.pagination.page,
          active: this.filterActive,
          search: this.search
        }
      })
        .then((res) => {
          if (res.data.success) {
            if (this.pagination.page === 1) {
              this.forms = res.data.patients
            } else {
              this.forms = this.forms.concat(res.data.patients)
            }
            this.pagination = res.data.pagination
          }
        })
        .finally(() => {
          this.$q.loading.hide()
        })
    },
    openUsuario (id) {
      this.userId = id
      this.OpenModalFicha = true
      // this.$refs.showUsuario.getUser()
    },
    resetPagination () {
      this.pagination = {
        count: 0,
        limit: 20,
        nextPage: true,
        offset: 0,
        page: 0
      }
      this.users = []
    },
    changeFilter (opt) {
      this.label = opt.label
      this.filterActive = opt.value
      this.resetPagination()
      this.getForms()
    },
    handleScroll () {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        this.getForms()
      }
    }
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
    this.resetPagination()
    this.getForms()
  },
  beforeRouteLeave (to, from, next) {
    window.removeEventListener('scroll', this.handleScroll)
    next()
  }
}
</script>
