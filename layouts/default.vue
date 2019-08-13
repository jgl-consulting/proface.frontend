<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      temporary
      fixed app
    >
      <v-list>
        <v-list-tile>
          <v-list-tile-action>
             <v-icon color="primary">fa fa-tooth</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              <h1 class="primary--text">
                Proface
              </h1>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <span class="my-3"></span>
        <MenuTree :menus="menus"></MenuTree>
        <v-spacer></v-spacer>
        <v-list-tile class="my-2" @click.stop="miniVariant = !miniVariant">
          <v-list-tile-action>
            <v-icon small>
              {{ `fa-chevron-${miniVariant ? 'right' : 'left'}`}}
            </v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="font-weight-bold">
              Contraer
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
      <v-container fluid py-4 px-5>
        <page-breadcrumbs></page-breadcrumbs>
        <nuxt/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import MenuTree from '@/components/common/MenuTree'
import UserDetailsMenu from '@/components/common/UserDetailsMenu'
import ProfaceLogo from '@/components/common/ProfaceLogo'
import strings from '@/util/strings';
import menus from '@/util/menus';
import { mapState } from 'vuex';

export default {
  components: {
    UserDetailsMenu,
    ProfaceLogo,
    MenuTree
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: true,
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
