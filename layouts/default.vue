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
        <v-divider></v-divider>
        <v-list-tile
          class="my-2"
          v-for="(menu, i) in menus"
          :key="i" 
          :to="menu.to"
          router 
          exact
        >
          <v-list-tile-action>
            <v-icon small>{{ menu.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="font-weight-bold">
              {{ menu.title }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
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
      <v-container fluid pa-0>
        <v-container pb-0>
          <v-layout row wrap>
            <v-flex xs12>
              <v-breadcrumbs 
                large 
                class="px-0" 
                divider="/" 
                :items="this.displayBreadcrumbs">
                <template v-slot:item="{ item }">
                  <v-breadcrumbs-item nuxt :to="item.href" exact>
                    {{ item.text }}
                  </v-breadcrumbs-item>
                </template>
              </v-breadcrumbs>
            </v-flex>
          </v-layout>
        </v-container>
        <nuxt :key="$route.name"/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import UserDetailsMenu from '@/components/common/UserDetailsMenu'
import ProfaceLogo from '@/components/common/ProfaceLogo'
import strings from '@/util/strings';
import menus from '@/util/menus';
import { mapState, mapGetters } from 'vuex';

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
    ...mapGetters(['displayBreadcrumbs']),
    ...mapState('auth',[
      'user'
    ]),
    strings: () => strings,
    menus: () => menus,
  }
}
</script>
