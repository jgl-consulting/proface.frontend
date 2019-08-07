import {
  SET_SALE_STATUSES,
  SET_PAGE,
  SET_PAGINATION
} from '@/util/mutations-types';
import _ from 'lodash';
export const state = () => ({
  saleStatuses: [],
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
  [SET_SALE_STATUSES](state, saleStatuses) {
    state.saleStatuses = saleStatuses;
  },
  [SET_PAGE](state, page) {
    state.page = page;
  },
  [SET_PAGINATION](state, pagination) {
    state.pagination = pagination;
  }
}
export const actions = {
  async fetchSaleStatuses({
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
      saleStatuses,
      page
    } = await this.$saleStatuses.pageSaleStatuses(requestPage, size, sortBy, direction, filter);
    commit(SET_SALE_STATUSES, saleStatuses);
    commit(SET_PAGE, page);
    commit(SET_PAGINATION, {
      requestPage,
      size,
      sortBy,
      descending
    })
  },
  async createSaleStatus({
    dispatch
  }, {
    saleStatus
  }) {
    await this.$saleStatuses.createSaleStatus(saleStatus);
    await dispatch('fetchSaleStatuses');
  },
  async updateSaleStatus({
    dispatch
  }, {
    saleStatus
  }) {
    await this.$saleStatuses.updateSaleStatus(saleStatus);
    await dispatch('fetchSaleStatuses');
  },
  async deleteSaleStatus({
    dispatch
  }, {
    saleStatus
  }) {
    await this.$saleStatuses.deleteSaleStatus(saleStatus);
    await dispatch('fetchSaleStatuses');
  }
}
