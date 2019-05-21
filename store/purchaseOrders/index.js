import { 
    SET_PURCHASE_ORDERS,
    SET_PAGE,
    SET_PAGINATION
  } from '@/util/mutations-types';
  import _ from 'lodash';
  export const state = () => ({
    purchaseOrders: [],
    products: [],
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
      rowsPerPage: 20,// -1 for All",
      sortBy: 'id'
    }
  })
  
  export const mutations = {
    [SET_PURCHASE_ORDERS](state, purchaseOrders){
      state.purchaseOrders = purchaseOrders;
    },
    [SET_PAGE](state, page) {
      state.page = page;
    },
    [SET_PAGINATION](state, pagination) {
      state.pagination = pagination;
    }
  }
  export const actions = {
    async fetchPurchaseOrders({ state, commit }, pagination) {
      const { requestPage, size, sortBy, descending } = pagination || state.pagination;
      const direction = descending ? 'desc' : 'asc';
      const { purchaseOrders, page } = await this.$purchaseOrders.listPurchaseOrders(requestPage, size, sortBy, direction);
      commit(SET_PURCHASE_ORDERS, purchaseOrders);
      commit(SET_PAGE, page);
      commit(SET_PAGINATION, { requestPage, size, sortBy, descending })
    },
    async createPurchaseOrder({ dispatch }, { purchaseOrder }) {
      await this.$purchaseOrders.createPurchaseOrder(purchaseOrder);
      await dispatch('fetchPurchaseOrders');
    },
    async updatePurchaseOrder({ dispatch }, { purchaseOrder }) {
      await this.$purchaseOrders.updatePurchaseOrder(purchaseOrder);
      await dispatch('fetchPurchaseOrders');
    },
    async deletePurchaseOrder({ dispatch }, { purchaseOrder }) {
      await this.$purchaseOrders.deletePurchaseOrder(purchaseOrder);
      await dispatch('fetchPurchaseOrders');
    }
  }