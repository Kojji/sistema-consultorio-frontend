<template>
  <q-list style="width: 230px">
    <div class="q-pa-md">
      <div>
        <!-- <q-btn
          outline
          round
          :ripple="false"
          class="float-left"
          style="margin-right: 10px"
          color="grey-8 text-white"
        >
          <q-avatar size="48px">
            <img v-if="user.img" :src="user.img" />
            <span v-else>{{ sigla(user.name) }}</span>
          </q-avatar>
        </q-btn> -->
        <div class="text-subtitle1">{{ redux(user.name) }}</div>
        <div class="text-subtitle2 text-grey" style="cursor: help">
          {{ redux(user.email) }}
          <q-tooltip
            :anchor="!$q.screen.lt.md ? 'bottom middle' : 'top middle'"
            :self="!$q.screen.lt.md ? 'top middle' : 'bottom middle'"
            content-style="font-size: 12px"
            :offset="[10, 10]"
            content-class="bg-grey-8"
            v-if="user.email && user.email.length >= 16"
          >{{ user.email }}</q-tooltip>
        </div>
      </div>
    </div>
    <q-separator />
    <div style="margin-top: 10px">
      <q-item clickable to="/perfil">
        <q-item-section>Perfil e Conta</q-item-section>
      </q-item>
      <q-item clickable disable>
        <q-item-section>Ajuda e Feedback</q-item-section>
      </q-item>
    </div>

    <q-item
      clickable
      class="bg-grey-3 text-grey-10"
      @click="logout()"
    >
      <q-item-section avatar>
        <q-icon name="mdi-power" />
      </q-item-section>

      <q-item-section>Logout</q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'menu-drawer',
  methods: {
    // notificar () {
    //   this.$store.dispatch("utils/notificarPremium", {
    //     notificar: true,
    //     EmpresaId: this.user.Empresa.id,
    //     UserId: this.user.id
    //   });
    // },
    sigla (user) {
      const nome = String(user)
      const nomeArray = nome.split(' ')

      return nomeArray[0][0] + nomeArray[nomeArray.length - 1][0]
    },
    logout () {
      // this.$store.commit("signedin/signed", false);
      // this.$store.dispatch("chat/disconnect", { socket: this.$socket, UserId: this.user.id});
      // this.$store.dispatch("users/updateConnectStatus", { token: this.token, status: false });
      // this.$store.commit("signedin/token", null);
      this.$q.cookies.remove('token')
      // this.$q.localStorage.remove('vuex')
      this.$router.push('/login')
    },
    redux (value) {
      return value && value.length <= 26 ? value : value.substr(0, 16) + '...'
    }
  },
  computed: {
    // ...mapGetters("parametros", ["empresas"]),
    ...mapGetters('login', ['user']),
    // ...mapGetters("signedin", ["token"]),
    // ...mapGetters("utils", ["sereiNotificado", "carregandoNotificacao"]),
    loadingLayout: {
      get () {
        return this.$store.getters['utils/getLoadingLayout']
      },
      set (value) {
        this.$store.commit('utils/setLoadingLayout', value)
      }
    }
    // dropDownMenu: {
    //   get () {
    //     return this.$store.getters['utils/comandasapp']
    //   },
    //   set (value) {
    //     this.$store.commit('utils/comandasapp', value)
    //   }
    // }
  }
}
</script>
