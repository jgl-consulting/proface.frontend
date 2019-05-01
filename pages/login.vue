<template>
  <v-layout fill-height wrap row justify-center align-content-center >
    <v-flex sm7 md5 lg4>
      <notification class="mb-3" v-if="error" :message="$data[error]"/>
      <v-card class="px-3 py-5" elevation="3">
        <v-card-text>
          <v-form class="text-xs-center" ref="loginForm" lazy-validation>
            <proface-logo class="mb-5"></proface-logo>
            <v-text-field
              label="Usuario"
              v-model="user.username"
              prepend-icon="fa-user"
            ></v-text-field>
            <v-text-field
              v-model="user.password"
              label="Contraseña"
              min="8"
              prepend-icon="lock"
              :append-icon="value ? 'fa-eye' : 'fa-eye-slash'"
              @click:append="value = !value"
              :type="value ? 'password' : 'text'"
            ></v-text-field>
            <v-btn class="mt-5" large color="primary" 
              :loading="busy"
              @click.prevent="login">
              <v-icon small class="mr-3">fa-sign-in-alt</v-icon>
              <span class="font-weight-bold">Iniciar Sesión</span>
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'

import QueryString from 'query-string'
import strings from '@/util/strings'

import Notification from '@/components/Notification'
import ProfaceLogo from '@/components/ProfaceLogo'

export default {
  components: {
    Notification,
    ProfaceLogo
  },
  layout: 'empty',
  auth: false,
  data: () => ({
    user: {
      username: "",
      password: ""
    },
    value: true,
    error: null,
    ...strings
  }),
  computed: {
    ...mapState('auth',['busy'])
  },
  methods: {
    async login(){
      const user = this.user;
      const data = QueryString.stringify({
        grant_type: 'password',
        ...user,
        scopes: []
      });

      try {
        await this.$auth.loginWith('local', { data });
        this.$router.push('/');
      } catch(error) {
        console.log({ error });
        this.error = error.response.data.error;
      }  
    }
  }
}
</script>
