<template>
  <div>
    <q-header elevated class="bg-black">
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
              <span v-else>{{ sigla(user.name) }}</span>
            </q-avatar>
          </template>
          <menu-drawer />
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>
    <!-- <q-header
      class="bg-accent"
    >
      <q-toolbar v-ripple:primary="colorBar" class="shadow-4">
        <q-btn
          flat
          round
          dense
          icon="menu"
          color="white"
          style="margin-right: 10px"
          @click="drawer = !drawer"
        />
        <q-space />
        <modal-new-institution
          v-if="OpenModalNewInstitution"
          :OpenModal="OpenModalNewInstitution"
          v-on:closeModal="OpenModalNewInstitution = false"
        />
        <q-separator vertical />

      </q-toolbar>

    </q-header>
    <q-drawer
      v-model="drawer"
      show-if-above
      :width="230"
      :mini="mini && !fixSidebar"
      :breakpoint="500"
      content-class="bg-primary"
      content-style="overflow-x: hidden"
    >
      <q-btn
        v-if="!mini"
        flat
        class="q-mt-lg"
      >
        <img src="~/assets/logo-nova-sem-seta-transparente.png" />
      </q-btn>
      <q-scroll-area
        :style="
          !mini
            ? 'height: calc(100% - 175px); margin-top: 0px;'
            : 'height: calc(100% - 175px); margin-top: 0px;'
        "
      >
        <q-list padding>
          <q-item
            v-if="mini"
            style="height: calc(100% - 175px);"
          >
          </q-item>
          <q-item
            v-for="(coluna) in colunas"
            :key="coluna.url"
            clickable
            v-ripple
            :to="coluna.url"
            class="text-white"
            active-class="bg-accent text-white class--active"
            :disable="!user.InstitutionId && coluna.label === 'Minhas Turmas' || coluna.external"
          >
            <q-item-section side avatar class="row" v-if="!isMd">
              <span class="text-white" style="font-size: 7pt">
                <q-icon size="24px" class="justify-center" :name="coluna.icon" />
              </span>
            </q-item-section>

            <q-item-section avatar v-else>
              <q-icon :name="coluna.icon" />
            </q-item-section>

            <q-item-section>{{ coluna.label }}</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-item
        class="text-white"
        active-class="bg-accent text-white class--active"
        to="/precisa-de-ajuda"
      >
        <q-item-section side avatar class="row" v-if="!isMd">
          <span class="text-white" style="font-size: 7pt">
            <q-icon size="24px" class="justify-center" name="mdi-help" />
          </span>
        </q-item-section>

        <q-item-section avatar v-else>
          <q-icon name="mdi-help" />
        </q-item-section>

        <q-item-section>Precisa de ajuda?</q-item-section>
      </q-item>
    </q-drawer> -->
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
    // filtros: true,
    text: '',
    mini: false,
    fixSidebar: false,
    OpenModalNewInstitution: false
  }),
  watch: {
    // isMd (value) {
    //   this.filtros = value ? false : true;
    // }
  },
  methods: {
    sigla (user) {
      if (!user) return
      const nome = String(user)
      const nomeArray = nome.split(' ')

      return nomeArray[0][0] + nomeArray[nomeArray.length - 1][0]
    }
    // logout() {
    //   localStorage.removeItem("token");
    //   this.$router.push("/login");
    // },
    // showFiltro() {
    //   return this.$route.path === "/turmas";
    // }
  },
  computed: {
    ...mapGetters('login', ['user']),
    // // ...mapGetters("parametros", ["empresas"]),
    // ...mapGetters("utils", ["colorBar"]),
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
