import {
    USERS_ENDPOINT
  } from '@/util/endpoints'
  export default class UsersService {
    constructor({
      $axios
    }) {
      this.$axios = $axios;
    }
    async listUsers() {
      return await this.$axios.$get(USERS_ENDPOINT);
    }
  }
  