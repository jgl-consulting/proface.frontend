import {
    CLIENTS_ENDPOINT
  } from '@/util/endpoints';
  
  export default class ClientsService {
    constructor({
      $axios
    }) {
      this.$axios = $axios;
    }
    async pageClients(page, size, sortBy, direction, filter) {
      const clients = await this.$axios.$get(CLIENTS_ENDPOINT, {
        params: {
          page,
          size,
          sort: sortBy ? `${sortBy},${direction}` : sortBy,
          filter
        }
      });
  
      const extract = (client) => ({
        ...client
      });
  
      return {
        clients: clients.content.map(extract),
        page: {
          totalElements: clients.totalElements,
          totalPages: clients.totalPages,
          page: clients.page,
          size: clients.size,
          isSorted: clients.isSorted
        }
      }
    }
    async listClients() {
      return await this.$axios.$get(CLIENTS_ENDPOINT, {
        params: {
          unpaged: true
        }
      });
    }
    async getClientById(clientId) {
      return this.$axios.$get(`${CLIENTS_ENDPOINT}/${clientId}`);
    }
    async createClient(client) {
      await this.$axios.$post(CLIENTS_ENDPOINT, client);
    }
    async updateClient(client) {
      const {
        id
      } = client;
      await this.$axios.$put(`${CLIENTS_ENDPOINT}/${id}`, client);
    }
    async deleteClient({
      id
    }) {
      await this.$axios.$delete(`${CLIENTS_ENDPOINT}/${id}`);
    }
  }
  