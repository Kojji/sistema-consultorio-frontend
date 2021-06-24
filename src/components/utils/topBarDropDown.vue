<template>
  <div>
    <q-header elevated class="bg-primary">
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        <q-toolbar-title>Cadastra-Re</q-toolbar-title>
        <q-btn-dropdown
          round
          no-caps
          no-wrap
          flat
          stretch
        >
          <template v-slot:label>
            <q-avatar :color="!user.photo ? 'secondary' : null">
              <img v-if="user.photo" :src="user.photo">
              <span class="text-accent" v-else>{{ sigla(user.name) }}</span>
            </q-avatar>
          </template>
          <menu-drawer />
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'dropDownMenu',
  components: {
    menuDrawer: () => import('src/components/utils/menu-drawer.vue')
  },
  data: () => ({
    text: '',
    mini: false,
    fixSidebar: false,
    OpenModalNewInstitution: false
  }),
  watch: {
  },
  methods: {
    sigla (user) {
      if (!user) return
      const nome = String(user)
      const nomeArray = nome.split(' ')

      return nomeArray[0][0] + nomeArray[nomeArray.length - 1][0]
    }
  },
  computed: {
    ...mapGetters('login', ['user']),
    drawer: {
      get () {
        return this.$store.getters['utils/getDrawer']
      },
      set (value) {
        this.$store.commit('utils/setDrawer', value)
      }
    }
  }
}
</script>

<style lang="scss">
.text-almostdark {
  color: #804811;
}

.drawer_sidebar {
  background: rgb(25,118,210);
  background: linear-gradient(180deg, rgba(25,118,210,1) 0%, rgba(38,166,154,1) 55%);
}

.drawer_sidebar_invertida {
  background: rgb(25,118,210);
  background: linear-gradient(-180deg, rgba(25,118,210,1) 0%, rgba(38,166,154,1) 55%);
}

.class--active {
  border-left: 5px solid $secondary
}
</style>
