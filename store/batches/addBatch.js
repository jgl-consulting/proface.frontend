import {
    SET_PRODUCTS,
    SET_PAGE,
    SET_PAGINATION,
    SET_PURCHASE_ORDERS,
    SET_BATCH_TYPES,
    SET_LOCATIONS
  } from '@/util/mutations-types';
  import _ from 'lodash';
  export const state = () => ({
    products: [],
    purchaseOrders: [],
    batchTypes: [],
    locations: [],
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
    [SET_PURCHASE_ORDERS](state, purchaseOrders) {
      state.purchaseOrders = purchaseOrders;
    },
    [SET_BATCH_TYPES](state, batchTypes) {
      state.batchTypes = batchTypes;
    },
    [SET_LOCATIONS](state, locations) {
      state.locations = locations;
    },
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
    async fetchPurchaseOrders({
      commit
    }) {
      const purchaseOrders = await this.$purchaseOrders.listPurchaseOrders();
      commit(SET_PURCHASE_ORDERS, purchaseOrders);
    },
    async fetchBatchTypes({
      commit
    }) {
      const batchTypes = await this.$batchTypes.listBatchTypes();
      commit(SET_BATCH_TYPES, batchTypes);
    },
    async fetchLocations({
      commit
    }) {
      const locations = await this.$locations.listLocations();
      commit(SET_LOCATIONS, locations);
    },
  }
  