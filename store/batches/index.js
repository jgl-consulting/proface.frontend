import {
    SET_BATCHES,
    SET_PAGE,
    SET_PAGINATION
  } from '@/util/mutations-types';
  import _ from 'lodash';
  export const state = () => ({
    batches: [],
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
    [SET_BATCHES](state, batches) {
      state.batches = batches;
    },
    [SET_PAGE](state, page) {
      state.page = page;
    },
    [SET_PAGINATION](state, pagination) {
      state.pagination = pagination;
    }
  }
  export const actions = {
    async fetchBatches({
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
        batches,
        page
      } = await this.$batches.pageBatches(requestPage, size, sortBy, direction, filter);
      commit(SET_BATCHES, batches);
      commit(SET_PAGE, page);
      commit(SET_PAGINATION, {
        requestPage,
        size,
        sortBy,
        descending
      })
    },
    async createBatch({
      dispatch
    }, {
      batch
    }) {
      await this.$batches.createBatch(batch);
      await dispatch('fetchBatches');
    },
    async updateBatch({
      dispatch
    }, {
      batch
    }) {
      await this.$batches.updateBatch(batch);
      await dispatch('fetchBatches');
    },
    async deleteBatch({
      dispatch
    }, {
      batch
    }) {
      await this.$batches.deleteBatch(batch);
      await dispatch('fetchBatches');
    }
  }
  