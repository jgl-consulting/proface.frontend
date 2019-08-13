import {
  SET_CLIENTS,
  SET_CLIENT_TYPES,
  SET_PAGE,
  SET_PAGINATION
} from '@/util/mutations-types';
import _ from 'lodash';
export const state = () => ({
  clients: [],
  clientTypes: [],
  page: {
    size: 0,
    totalElements: 0,
    totalPages: 0,
    number: 0,
    sort: undefined
  },
  pagination: {
    descending: false,
    page: 1,
    rowsPerPage: 20, // -1 for All",
    sortBy: 'id'
  }
})

export const mutations = {
  [SET_CLIENTS](state, clients) {
    state.clients = clients;
  },
  [SET_CLIENT_TYPES](state, clientTypes) {
    state.clientTypes = clientTypes;
  },
  [SET_PAGE](state, page) {
    state.page = page;
  },
  [SET_PAGINATION](state, pagination) {
    state.pagination = pagination;
  }
}
export const actions = {
  async fetchClients({
    state,
    commit
  }, pagination) {
    const {
      requestPage,
      size,
      sortBy,
      descending,
      filter
    } = pagination || state.pagination;
    const direction = descending ? 'desc' : 'asc';
    const {
      clients,
      page
    } = await this.$clients.pageClients(requestPage, size, sortBy, direction, filter);
    commit(SET_CLIENTS, clients);
    commit(SET_PAGE, page);
    commit(SET_PAGINATION, {
      requestPage,
      size,
      sortBy,
      descending
    })
  },
  async searchClients({
    state,
    commit
  }, search, pagination) {
    const {
      requestPage,
      size,
      sortBy,
      descending
    } = pagination || state.pagination;
    const direction = descending ? 'desc' : 'asc';
    const {
      clients,
      page
    } = await this.$clients.pageClients(search, requestPage, size, sortBy, direction);
    commit(SET_CLIENTS, clients);
    commit(SET_PAGE, page);
    commit(SET_PAGINATION, {
      requestPage,
      size,
      sortBy,
      descending
    })
  },
  async fetchClientTypes({
    commit
  }) {
    const clientTypes = await this.$clientTypes.listClientTypes();
    commit(SET_CLIENT_TYPES, clientTypes);
  },
  async createClient({
    dispatch
  }, {
    client
  }) {
    await this.$clients.createClient(client);
    await dispatch('fetchClients');
  },
  async updateClient({
    dispatch
  }, {
    client
  }) {
    await this.$clients.updateClient(client);
    await dispatch('fetchClients');
  },
  async deleteClient({
    dispatch
  }, {
    client
  }) {
    await this.$clients.deleteClient(client);
    await dispatch('fetchClients');
  }
}
