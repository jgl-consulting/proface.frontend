import {
    SET_UNITS,
    SET_PAGE,
    SET_PAGINATION
  } from '@/util/mutations-types';
  import _ from 'lodash';
  export const state = () => ({
    units: [],
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
    [SET_UNITS](state, units) {
      state.units = units;
    },
    [SET_PAGE](state, page) {
      state.page = page;
    },
    [SET_PAGINATION](state, pagination) {
      state.pagination = pagination;
    }
  }
  export const actions = {
    async fetchUnits({
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
        units,
        page
      } = await this.$units.pageUnits(requestPage, size, sortBy, direction, filter);
      commit(SET_UNITS, units);
      commit(SET_PAGE, page);
      commit(SET_PAGINATION, {
        requestPage,
        size,
        sortBy,
        descending
      })
    },
    async createUnit({
      dispatch
    }, {
      unit
    }) {
      await this.$units.createUnit(unit);
      await dispatch('fetchUnits');
    },
    async updateUnit({
      dispatch
    }, {
      unit
    }) {
      await this.$units.updateUnit(unit);
      await dispatch('fetchUnits');
    },
    async deleteUnit({
      dispatch
    }, {
      unit
    }) {
      await this.$units.deleteUnit(unit);
      await dispatch('fetchUnits');
    }
  }
  