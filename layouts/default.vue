<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-tile avatar exact>
          <v-list-tile-avatar color="primary">
             <span class="font-weight-bold white--text">{{ firstLetter }}</span>
          </v-list-tile-avatar>
          <v-list-tile-content>
            {{ fullName }}
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title" />
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
      <v-toolbar-title>{{ appTitle }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.prevent="logout">
        <v-icon>fa-sign-out-alt</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import strings from '@/util/strings';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      clipped: true,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'apps',
          title: 'Inicio',
          to: '/'
        }
      ],
      miniVariant: false,
      ...strings
    }
  },
  computed: {
    ...mapState('auth',[
      'user'
    ]),
    firstLetter() {
      return this.fullName ? this.fullName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('') : "";
    },
    fullName(){
      const { firstName, lastName } = this.user;
      return `${firstName} ${lastName}`
    }
  },
  methods: {
    async logout() {
      await this.$auth.logout();
      this.$router.push('/login')
    }
  }
}
</script>
