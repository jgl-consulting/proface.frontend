import {
  SET_PRODUCTS,
  SET_PAGE,
  SET_PAGINATION,
  SET_PURCHASE_STATUSES,
  SET_SUPPLIERS,
  SET_CURRENCIES
} from '@/util/mutations-types';
import _ from 'lodash';
export const state = () => ({
  products: [],
  purchaseStatuses: [],
  suppliers: [],
  currencies: [],
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
  [SET_PURCHASE_STATUSES](state, purchaseStatuses) {
    state.purchaseStatuses = purchaseStatuses;
  },
  [SET_SUPPLIERS](state, suppliers) {
    state.suppliers = suppliers;
  },
  [SET_CURRENCIES](state, currencies) {
    state.currencies = currencies;
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
      descending
    } = pagination || state.pagination;
    const direction = descending ? 'desc' : 'asc';
    const {
      products,
      page
    } = await this.$products.pageProducts(requestPage, size, sortBy, direction);
    commit(SET_PRODUCTS, products);
    commit(SET_PAGE, page);
    commit(SET_PAGINATION, {
      requestPage,
      size,
      sortBy,
      descending
    })
  },
  async fetchPurchaseStatuses({
    commit
  }) {
    const purchaseStatuses = await this.$purchaseStatuses.listPurchaseStatuses();
    commit(SET_PURCHASE_STATUSES, purchaseStatuses);
  },
  async fetchCurrencies({ commit }) {
    const currencies = await this.$currencies.listCurrencies();
    commit(SET_CURRENCIES, currencies);
  },
  async fetchSuppliers({ commit }) {
    const suppliers = await this.$suppliers.listSuppliers();
    commit(SET_SUPPLIERS, suppliers);
  },
}
