import {
    SET_UNITS,
    SET_PRODUCTS,
    SET_LOCATIONS,
    SET_UNIT_STATUSES,
    SET_BATCHES,
    SET_PAGE,
    SET_PAGINATION
  } from '@/util/mutations-types';
  import _ from 'lodash';
  export const state = () => ({
    units: [],
    products: [],
    locations: [],
    unitStatuses: [],
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
    [SET_UNITS](state, units) {
      state.units = units;
    },
    [SET_PAGE](state, page) {
      state.page = page;
    },
    [SET_PAGINATION](state, pagination) {
      state.pagination = pagination;
    },
    [SET_UNIT_STATUSES](state, unitStatuses){
      state.unitStatuses = unitStatuses;
    },
    [SET_LOCATIONS](state, locations){
      state.locations = locations;
    },
    [SET_PRODUCTS](state, products){
      state.products = products;
    },
    [SET_BATCHES](state, batches){
      state.batches = batches;
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
    },
    async fetchProducts({commit}) {
      const products = await this.$products.listProducts();
      commit(SET_PRODUCTS, products);
    },
    async fetchLocations({commit}) {
      const locations = await this.$locations.listLocations();
      commit(SET_LOCATIONS, locations);
    },
    async fetchUnitStatuses({commit}) {
      const unitStatuses = await this.$unitStatuses.listUnitStatuses();
      commit(SET_UNIT_STATUSES, unitStatuses);
    },
    async fetchBatches({commit}) {
      const batches = await this.$batches.listBatches();
      commit(SET_BATCHES, batches);
    }
  }
  