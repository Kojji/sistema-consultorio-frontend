<template>
  <div class="q-col-gutter-md row q-ma-xs">
    <div class="col-12">
      <q-table
        title="Usuários"
        :data="users"
        :columns="columns"
        row-key="name"
        no-data-label="Nenhum usuário encontrado"
        :pagination="{
          rowsPerPage: 0
        }"
      >
      <template v-slot:top>
          <div class="q-table__control">
            <div class="q-table__title">
              Usuários
              <p class="text-caption">Mostrando {{users.length}} de {{pagination.count}} {{pagination.count > 1 ? 'usuários' : 'usuário'}}.</p>
              <p>
                <q-btn
                  class="text-grey-8"
                  style="border: 1px dashed rgba(0, 0, 0, 0.12)"
                  label="Adicionar novo Usuário"
                  icon="mdi-plus-circle-outline"
                  flat
                  dense
                  :disable="true"
                  no-caps
                  no-wrap
                />
                  <!-- @click="OpenModal = true" -->
              </p>
            </div>
          </div>

          <q-space />

          <!-- <q-select
            v-model="visibleColumns"
            multiple
            outlined
            dense
            options-dense
            :display-value="$q.lang.table.columns"
            emit-value
            map-options
            :options="columns"
            option-value="name"
            style="min-width: 150px"
          /> -->

          <q-btn flat no-caps no-wrap color="secondary" :label="label" class="q-ml-md">
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item
                  v-for="(opt, index) in options"
                  :key="'group-option-' + index"
                  clickable
                  v-close-popup
                  :class="{'bg-red-5 text-white': label === opt.label}"
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
              <q-icon name="circle" :color="checkColor(props.row.active)" size="20px" />
            </q-td>
            <q-td>
              {{ props.row.name }}
            </q-td>
            <q-td>
              {{ props.row.email }}
            </q-td>
            <q-td>
              {{ props.row.cpf }}
            </q-td>
            <q-td>
              {{ moment(props.row.createdAt).format('DD/MM/YYYY HH:mm') + 'h' }}
            </q-td>
          </q-tr>
        </template>
        <template v-slot:bottom>
          <div />
        </template>
      </q-table>
      <modal-show-usuario
        v-if="OpenModalUser"
        :OpenModal="OpenModalUser"
        ref="showUsuario"
        v-on:closeModal="OpenModalUser = false"
        v-on:repaginate="resetPagination(), getUsers()"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Users',
  meta: {
    title: 'Cadastra-Re',
    titleTemplate: title => `${title} - Usuários`
  },
  components: {
    modalShowUsuario: () => import('src/components/users/modal-show-usuario.vue')
  },
  data: () => ({
    OpenModalUser: false,
    loading: false,
    filterConfirmed: true,
    users: [],
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
        name: 'active',
        label: 'Ativo',
        align: 'left',
        field: row => row.active,
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
        name: 'email',
        label: 'E-mail',
        align: 'left',
        field: row => row.email,
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
        name: 'createdAt',
        label: 'Data de Criação',
        align: 'left',
        field: row => row.createdAt,
        format: val => `${val}`,
        sortable: true
      }
    ],
    pagination: {
      count: 0,
      limit: 20,
      nextPage: true,
      offset: 0,
      page: 0
    },
    label: 'Usuários do sistema',
    options: [
      {
        label: 'Usuários do sistema',
        value: true
      },
      {
        label: 'Cadastros pendentes',
        value: null
      },
      {
        label: 'Cadastros recusados',
        value: false
      }
    ],
    moment: null
  }),
  computed: {
    userId: {
      get () {
        return this.$store.getters['users/getSelectedUserId']
      },
      set (value) {
        this.$store.commit('users/setSelectedUserId', value)
      }
    }
  },
  methods: {
    checkColor (confirmed) {
      if (confirmed === true) {
        return 'positive'
      } else {
        return 'negative'
      }
    },
    getUsers () {
      this.loading = true
      this.$axios.get('/users', {
        params: {
          page: ++this.pagination.page,
          confirmed: this.filterConfirmed
        }
      })
        .then((res) => {
          if (res.data.success) {
            this.users = this.users.concat(res.data.users)
            this.pagination = res.data.pagination
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    openUsuario (id) {
      this.userId = id
      this.OpenModalUser = true
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
      this.filterConfirmed = opt.value
      this.resetPagination()
      this.getUsers()
    },
    handleScroll () {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        this.getUsers()
      }
    }
  },
  created () {
    this.moment = require('moment')
    this.moment.locale('pt-BR')
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
    this.resetPagination()
    this.getUsers()
  },
  beforeRouteLeave (to, from, next) {
    window.removeEventListener('scroll', this.handleScroll)
    next()
  }
}
</script>
