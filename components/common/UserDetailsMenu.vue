<template>
  <div v-if="user" class="text-xs-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="300"
      offset-x
    >
      <template v-slot:activator="{ on }">
        <span class="font-weight-bold">
          Hola {{ user.firstName }}!
        </span>
        <v-avatar color="primary darken-3 ml-2" v-on="on">
          <span class="font-weight-bold white--text">{{ firstLetter }}</span>
        </v-avatar>
      </template>
      <v-card>
        <v-list>
          <v-list-tile avatar>
            <v-list-tile-avatar color="primary darken-3">
              <span class="font-weight-bold white--text">{{ firstLetter }}</span>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>
                {{ fullName }}
              </v-list-tile-title>
              <v-list-tile-sub-title>
                {{ user.email }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon flat @click="manageUser(user)">
                <v-icon small>fa fa-cog</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>

        <v-divider></v-divider>
        <!--
        <v-list>
          <v-list-tile>
            <v-list-tile-action>
              <v-switch v-model="message" color="purple"></v-switch>
            </v-list-tile-action>
            <v-list-tile-title>Enable messages</v-list-tile-title>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-action>
              <v-switch v-model="hints" color="purple"></v-switch>
            </v-list-tile-action>
            <v-list-tile-title>Enable hints</v-list-tile-title>
          </v-list-tile>
        </v-list>
        -->
        <v-card-actions class="px-2 pt-3">
          <v-spacer></v-spacer>
          <v-btn color="accent" @click="logout" flat>
            <v-icon small>fa-sign-out-alt</v-icon>
            <span class="mx-1"></span>
            Cerrar sesión
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
  export default {
    props: ['user'],
    data: () => ({
      fav: true,
      menu: false,
      message: false,
      hints: true
    }),
    computed:{
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
      },
      manageUse(user) {
        console.log(user);
      },
    }
  }
</script>