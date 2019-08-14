<template>
  <v-layout fill-height wrap row justify-center align-content-center>
    <v-flex sm7 md5 lg4 xl3>
      <notification class="mb-3" v-if="error" :message="error"/>
      <v-card class="px-3 py-5" elevation="3">
        <v-card-text>
          <v-form class="text-xs-center" ref="loginForm" v-model="valid" lazy-validation>
            <proface-logo class="mb-5"></proface-logo>
            <v-text-field
              label="Usuario"
              v-model="user.username"
              prepend-icon="fa-user"
              :rules="usernameRules"
            ></v-text-field>
            <v-text-field
              v-model="user.password"
              label="Contraseña"
              min="8"
              prepend-icon="lock"
              :append-icon="value ? 'fa-eye' : 'fa-eye-slash'"
              @click:append="value = !value"
              :rules="passwordRules"
              :type="value ? 'password' : 'text'"
            ></v-text-field>
            <v-btn class="mt-5" large color="primary" @click.prevent="login">
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
import { mapState } from "vuex";

import QueryString from "query-string";
import strings from "@/util/strings";

import Notification from "@/components/common/Notification";
import ProfaceLogo from "@/components/common/ProfaceLogo";

import { required } from "@/util/validators";

export default {
  meta: {
    breadcrumbs: false
  },
  components: {
    Notification,
    ProfaceLogo
  },
  layout: "empty",
  auth: false,
  data: () => ({
    user: {
      username: "",
      password: ""
    },
    valid: false,
    value: true,
    error: null,
    ...strings
  }),
  computed: {
    ...mapState("auth", ["busy"]),
    usernameRules() {
      return [value => required(value, "El usuario es requerido")];
    },
    passwordRules() {
      return [value => required(value, "La contraseña es requerida")];
    }
  },
  methods: {
    async login() {
      if (this.$refs.loginForm.validate()) {
        const user = this.user;
        const data = QueryString.stringify({
          grant_type: "password",
          ...user,
          scopes: []
        });

        try {
          await this.$auth.loginWith("local", { data });
          this.$router.push("/");
        } catch (error) {
          this.error = error.response ? error.response.data.error : error.message;
        }
      } else {
        this.error = "Los campos no son válidos";
      }
    }
  }
};
</script>
