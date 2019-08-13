import {
    SET_CLIENT_TYPES,
    SET_PAGE,
    SET_PAGINATION
  } from '@/util/mutations-types';
  import _ from 'lodash';
  export const state = () => ({
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
    async fetchClientTypes({
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
        clientTypes,
        page
      } = await this.$clientTypes.pageClientTypes(requestPage, size, sortBy, direction, filter);
      commit(SET_CLIENT_TYPES, clientTypes);
      commit(SET_PAGE, page);
      commit(SET_PAGINATION, {
        requestPage,
        size,
        sortBy,
        descending
      })
    },
    async createClientType({
      dispatch
    }, {
      clientType
    }) {
      await this.$clientTypes.createClientType(clientType);
      await dispatch('fetchClientTypes');
    },
    async updateClientType({
      dispatch
    }, {
      clientType
    }) {
      await this.$clientTypes.updateClientType(clientType);
      await dispatch('fetchClientTypes');
    },
    async deleteClientType({
      dispatch
    }, {
      clientType
    }) {
      await this.$clientTypes.deleteClientType(clientType);
      await dispatch('fetchClientTypes');
    }
  }
  