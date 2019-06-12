import {
  SET_UNIT_STATUSES,
  SET_PAGE,
  SET_PAGINATION
} from '@/util/mutations-types';
import _ from 'lodash';
export const state = () => ({
  unitStatuses: [],
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
  [SET_UNIT_STATUSES](state, unitStatuses) {
    state.unitStatuses = unitStatuses;
  },
  [SET_PAGE](state, page) {
    state.page = page;
  },
  [SET_PAGINATION](state, pagination) {
    state.pagination = pagination;
  }
}
export const actions = {
  async fetchUnitStatuses({
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
      unitStatuses,
      page
    } = await this.$unitStatuses.pageUnitStatuses(requestPage, size, sortBy, direction, filter);
    commit(SET_UNIT_STATUSES, unitStatuses);
    commit(SET_PAGE, page);
    commit(SET_PAGINATION, {
      requestPage,
      size,
      sortBy,
      descending
    })
  },
  async createUnitStatus({
    dispatch
  }, {
    unitStatus
  }) {
    await this.$unitStatuses.createUnitStatus(unitStatus);
    await dispatch('fetchUnitStatuses');
  },
  async updateUnitStatus({
    dispatch
  }, {
    unitStatus
  }) {
    await this.$unitStatuses.updateUnitStatus(unitStatus);
    await dispatch('fetchUnitStatuses');
  },
  async deleteUnitStatus({
    dispatch
  }, {
    unitStatus
  }) {
    await this.$unitStatuses.deleteUnitStatus(unitStatus);
    await dispatch('fetchUnitStatuses');
  }
}
