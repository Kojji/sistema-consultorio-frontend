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
          <q-input outlined v-model="search" @input="searchInput" dense label="Buscar" placeholder="CPF,Nome ou Pasta" class="q-mr-md">
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
          <div class="col-12">
            <q-expansion-item
              style="border: 2px solid #10564F"
              expand-separator
              icon="reorder"
              label="Ordenação e Listagem"
              v-model="searchExpand"
            >
              <q-card>
                <q-card-section class="row q-col-gutter-sm">
                  <div class="col-4">
                    <q-select
                      label="Itens por página"
                      v-model="itensPerPage"
                      :options="optionsItensPerPage"
                      outlined
                      dense
                    >
                    </q-select>
                  </div>
                  <div class="col-4">
                    <q-select
                      label="Ordenar por"
                      v-model="column"
                      emit-value
                      map-options
                      :options="optionsListColumn"
                      outlined
                      dense
                    >
                    </q-select>
                  </div>
                  <div class="col-4">
                    <q-select
                      label="Ordem"
                      v-model="order"
                      emit-value
                      map-options
                      :options="optionsListOrder"
                      outlined
                      dense
                    >
                    </q-select>
                  </div>
                  <div class="col-12 row q-gutter-md justify-end">
                    <q-btn
                      outlined
                      label="Limpar Filtros"
                      color="primary"
                      @click="limparFiltros()"
                    >
                    </q-btn>
                    <q-btn
                      outlined
                      label="Ordenar"
                      color="primary"
                      @click="buscarPorFiltros()"
                    >
                    </q-btn>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </div>
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
      <div class="col-12 row q-my-md justify-center items-center">
        <q-btn
          round
          icon="navigate_before"
          color="primary"
          :disable="pagination.page <= 1"
          @click="pagination.page--, repaginateForms()"
          class="q-mr-sm"
        >
        </q-btn>
        <q-input
          dense
          mask="######"
          outlined
          v-model="page"
          :label="'Página( 1 a ' + Math.ceil(pagination.count/pagination.limit) + ' )'"
          @change="goToPage"
        >
        </q-input>
        <q-btn
          round
          icon="navigate_next"
          color="primary"
          :disable="!pagination.nextPage"
          @click="pagination.page++, repaginateForms()"
          class="q-ml-sm"
        >
        </q-btn>
      </div>
      <modalShowFicha
        v-if="OpenModalFicha"
        :OpenModal="OpenModalFicha"
        ref="showUsuario"
        v-on:closeModal="OpenModalFicha = false"
        v-on:repaginate="repaginateForms()"
      />
      <modalCreateFicha
        v-if="OpenModalNewFicha"
        :OpenModal="OpenModalNewFicha"
        v-on:closeModal="OpenModalNewFicha = false"
        v-on:repaginate="repaginateForms()"
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
    order: 'ASC',
    column: 'name',
    itensPerPage: 20,
    searchExpand: false,
    page: 1,
    columns: [
      {
        name: 'id',
        label: 'ID',
        align: 'left',
        field: row => row.id,
        format: val => `${val}`,
        sortable: false
      },
      {
        name: 'name',
        label: 'Nome',
        align: 'left',
        field: row => row.name,
        format: val => `${val}`,
        sortable: false
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
        sortable: false
      },
      {
        name: 'cpf',
        label: 'CPF',
        align: 'left',
        field: row => row.cpf,
        format: val => `${val}`,
        sortable: false
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
      active: true,
      search: '',
      column: 'name',
      order: 'ASC',
      count: 0,
      limit: 20,
      nextPage: true,
      offset: 0,
      page: 1
    },
    label: 'Arquivo Ativo',
    optionsListColumn: [
      {
        label: 'ID',
        value: 'id'
      },
      {
        label: 'Nome',
        value: 'name'
      },
      {
        label: 'Pasta',
        value: 'externalFile'
      }
    ],
    optionsItensPerPage: [
      20, 30, 40, 60
    ],
    optionsListOrder: [
      {
        label: 'Crescente',
        value: 'ASC'
      },
      {
        label: 'Decrescente',
        value: 'DESC'
      }
    ],
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
    repaginateForms () {
      this.$q.loading.show()
      this.forms = []
      this.$axios.get('/patients', {
        params: {
          page: this.pagination.page,
          active: this.pagination.active,
          search: this.pagination.search === '' ? null : this.pagination.search,
          limit: this.pagination.limit,
          column: this.pagination.column,
          order: this.pagination.order
        }
      }).then((res) => {
        if (res.data.success) {
          this.forms = res.data.patients
          this.pagination = res.data.pagination
          this.page = res.data.pagination.page
        }
      }).finally(() => {
        this.$q.loading.hide()
      })
    },
    searchInput () {
      this.resetPagination()
      this.pagination.search = this.search
      this.repaginateForms()
    },
    limparFiltros () {
      this.column = 'name'
      this.order = 'ASC'
      this.itensPerPage = 20
      this.pagination = {
        active: true,
        search: '',
        column: 'name',
        order: 'ASC',
        count: 0,
        limit: 20,
        nextPage: true,
        offset: 0,
        page: 1
      }
      this.repaginateForms()
      this.searchExpand = false
    },
    buscarPorFiltros () {
      this.pagination.column = this.column
      this.pagination.order = this.order
      this.pagination.limit = this.itensPerPage
      this.pagination.page = 1
      this.pagination.search = this.search
      this.repaginateForms()
      this.searchExpand = false
    },
    openUsuario (id) {
      this.userId = id
      this.OpenModalFicha = true
    },
    changeFilter (opt) {
      this.label = opt.label
      this.filterActive = opt.value
      this.resetPagination()
      this.pagination.active = opt.value
      this.repaginateForms()
    },
    goToPage () {
      if (this.page > Math.ceil(this.pagination.count / this.pagination.limit) && this.pagination.page !== this.page) {
        this.$q.notify({
          message: 'Página Não encontrada',
          color: 'red',
          position: 'top-right'
        })
      } else {
        this.pagination.page = this.page
        this.repaginateForms()
      }
    },
    resetPagination () {
      this.pagination = {
        active: true,
        search: '',
        column: 'name',
        order: 'ASC',
        count: 0,
        limit: 20,
        nextPage: true,
        offset: 0,
        page: 1
      }
      this.forms = []
    }
  },
  mounted () {
    this.resetPagination()
    this.repaginateForms()
  }
}
</script>
