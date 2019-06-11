import {
  SET_LOCATIONS,
  SET_PAGE,
  SET_PAGINATION
} from '@/util/mutations-types';
import _ from 'lodash';
export const state = () => ({
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
  [SET_LOCATIONS](state, locations) {
    state.locations = locations;
  },
  [SET_PAGE](state, page) {
    state.page = page;
  },
  [SET_PAGINATION](state, pagination) {
    state.pagination = pagination;
  }
}
export const actions = {
  async fetchLocations({
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
      locations,
      page
    } = await this.$locations.pageLocations(requestPage, size, sortBy, direction);
    commit(SET_LOCATIONS, locations);
    commit(SET_PAGE, page);
    commit(SET_PAGINATION, {
      requestPage,
      size,
      sortBy,
      descending
    })
  },
  async createLocation({
    dispatch
  }, {
    location
  }) {
    await this.$locations.createLocation(location);
    await dispatch('fetchLocations');
  },
  async updateLocation({
    dispatch
  }, {
    location
  }) {
    await this.$locations.updateLocation(location);
    await dispatch('fetchLocations');
  },
  async deleteLocation({
    dispatch
  }, {
    location
  }) {
    await this.$locations.deleteLocation(location);
    await dispatch('fetchLocations');
  }
}
