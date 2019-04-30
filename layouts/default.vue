<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed app
    >
      <v-list>
        <v-list-tile>
          <v-list-tile-content>
           <proface-logo></proface-logo>
          </v-list-tile-content>
        </v-list-tile>
        <span class="my-3"></span>
        <v-divider></v-divider>
        <v-list-tile
          v-for="(menu, i) in menus"
          :key="i" :to="menu.to"
          router exact
        >
          <v-list-tile-action>
            <v-icon small>{{ menu.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ menu.title }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      color="primary"
      :clipped-left="clipped"
      fixed
      app
      dark
    >
      <v-toolbar-side-icon @click="drawer = !drawer" />
      <v-toolbar-title>
        <span class="font-weight-bold">
          {{ currentTitle }}
        </span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <user-details-menu :user="user"></user-details-menu>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height ma-0 pa-0>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import UserDetailsMenu from '@/components/UserDetailsMenu'
import ProfaceLogo from '@/components/ProfaceLogo'
import strings from '@/util/strings';
import menus from '@/util/menus';
import { mapState } from 'vuex';

export default {
  components: {
    UserDetailsMenu,
    ProfaceLogo
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false
    }
  },
  computed: {
    ...mapState(['currentTitle']),
    ...mapState('auth',[
      'user'
    ]),
    strings: () => strings,
    menus: () => menus,
  }
}
</script>
