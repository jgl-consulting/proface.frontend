import {
  SET_PRODUCTS,
  SET_PAGE,
  SET_PAGINATION,
  SET_SALE_STATUSES,
  SET_CLIENTS,
  SET_USERS
} from '@/util/mutations-types';
import _ from 'lodash';
export const state = () => ({
  products: [],
  saleStatuses: [],
  clients: [],
  users: [],
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
  [SET_PRODUCTS](state, products) {
    state.products = products;
  },
  [SET_PAGE](state, page) {
    state.page = page;
  },
  [SET_PAGINATION](state, pagination) {
    state.pagination = pagination;
  },
  [SET_SALE_STATUSES](state, saleStatuses) {
    state.saleStatuses = saleStatuses;
  },
  [SET_CLIENTS](state, clients) {
    state.clients = clients;
  },
  [SET_USERS](state, users) {
    state.users = users;
  }
}
export const actions = {
  async fetchProducts({
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
      products,
      page
    } = await this.$products.pageProducts(requestPage, size, sortBy, direction, filter);
    commit(SET_PRODUCTS, products);
    commit(SET_PAGE, page);
    commit(SET_PAGINATION, {
      requestPage,
      size,
      sortBy,
      descending
    })
  },
  async fetchSaleStatuses({
    commit
  }) {
    const saleStatuses = await this.$saleStatuses.listSaleStatuses();
    commit(SET_SALE_STATUSES, saleStatuses);
  },
  async fetchUsers({
    commit
  }) {
    const users = await this.$users.listUsers();
    commit(SET_USERS, users);
  },
  async fetchClients({
    commit
  }) {
    const clients = await this.$clients.listClients();
    commit(SET_CLIENTS, clients);
  },
}
