<template>
  <div>
    <loading-page v-if="loadingLayout" />
    <q-layout view="hHh Lpr lff" v-else class="shadow-2 rounded-borders">
      <dropDownMenu class="no_print" />
      <!-- <q-header elevated class="bg-black">
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
          <q-toolbar-title>Cadastra-Re</q-toolbar-title>
        </q-toolbar>
      </q-header> -->

      <q-drawer
        v-model="drawer"
        show-if-above

        :mini="miniState"
        @mouseover="miniState = false"
        @mouseout="miniState = true"

        :width="200"
        :breakpoint="500"
        bordered
        content-class="bg-grey-3"
      >
        <q-scroll-area class="fit">
          <q-list padding>
            <q-item v-for="icon in getColunas" :key="icon.label" clickable v-ripple :to="icon.url">
              <q-item-section avatar>
                <q-icon :name="icon.icon" />
              </q-item-section>

              <q-item-section>
              {{ icon.label }}
              </q-item-section>
            </q-item>

            <q-separator />
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'MainLayout',
  components: {
    loadingPage: () => import('src/components/utils/loading-page.vue'),
    dropDownMenu: () => import('src/components/utils/topBarDropDown.vue')
  },
  data () {
    return {
      miniState: true
    }
  },
  methods: {
    always () {
      this.loadingLayout = true
      this.$store
        .dispatch('login/alwaysOn')
        .then(res => {
          if (res.data.success) {
            this.$q.cookies.set('token', res.data.token, { path: '/' })
            // this.$store.dispatch("chat/connect", { socket: this.$socket, token: res.data.token });
            // this.$store.dispatch("users/updateConnectStatus", { token: res.data.token, status: true });
            // this.$store.commit("signedin/signed", true);
            // this.$store.commit("signedin/token", res.data.token);
            this.$store.commit('login/user', res.data.user)
            this.$store.commit('login/setColunas', res.data.menus)
            // this.$store.commit('login/redirect', '/usuarios');
            // this.$store.commit('login/redirect', res.data.redirect);
            // this.$store.dispatch("parametros/buscaInstitutions")
          } else {
            // this.$store.commit("signedin/signed", false);
            // this.$store.commit("chat/socket", {});
            // this.$store.commit("signedin/token", null);
            this.$store.commit('login/login', {
              message: res.data.message,
              isLogged: false
            })
            // Notify.create({
            //   message: res.data.message,
            //   color: "orange",
            //   position: "top-right"
            // });
            this.$router.push('/login')
          }
          this.loadingLayout = false
        })
        .catch(() => {
          // this.$store.commit('signedin/signed", false);
          // this.$store.commit("signedin/token", null);
          this.$q.cookies.remove('token')
          this.loadingLayout = false
          this.$router.push('/login')
          // this.$forceUpdate
        })
    }
  },
  computed: {
    ...mapGetters('login', ['getColunas']),
    loadingLayout: {
      get () {
        return this.$store.getters['utils/getLoadingLayout']
      },
      set (value) {
        this.$store.commit('utils/setLoadingLayout', value)
      }
    },
    drawer: {
      get () {
        return this.$store.getters['utils/getDrawer']
      },
      set (value) {
        this.$store.commit('utils/setDrawer', value)
      }
    }
  },
  created () {
    this.always()
  }
}
</script>
