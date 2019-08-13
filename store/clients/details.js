import {
    SET_CLIENT,
    SET_SALE_ORDERS,
    SET_PAGE,
    SET_PAGINATION
  } from '@/util/mutations-types'
  export const state = () => ({
    client: {},
    saleOrders: [],
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
  });
  export const mutations = {
    [SET_CLIENT](state, client) {
      state.client = client;
    },
    [SET_SALE_ORDERS](state, saleOrders) {
      state.saleOrders = saleOrders;
    },
    [SET_PAGE](state, page) {
      state.page = page;
    },
    [SET_PAGINATION](state, pagination) {
      state.pagination = pagination;
    }
  }
  export const actions = {
    async fetchClient({
      commit
    }, {
      clientId
    }) {
      const client = await this.$clients.getClientById(clientId);
      commit(SET_CLIENT, client);
      return client;
    },
    async fetchSaleOrders({
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
      const clientId = this.$_.get(state, 'client.id', {});
      const clientFilter = "client.id:" + clientId;
      const completeFilter = filter? filter + clientFilter : clientFilter;
      const {
        saleOrders,
        page
      } = await this.$saleOrders.pageSaleOrders(requestPage, size, sortBy, direction, completeFilter);
      commit(SET_SALE_ORDERS, saleOrders);
      commit(SET_PAGE, page);
      commit(SET_PAGINATION, {
        requestPage,
        size,
        sortBy,
        descending
      })
    }
  }
  