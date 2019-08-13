import {
  SET_BANKS,
  SET_COUNTRIES,
  SET_PAGE,
  SET_PAGINATION
} from '@/util/mutations-types';
import _ from 'lodash';
export const state = () => ({
  banks: [],
  countries: [],
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
  [SET_BANKS](state, banks) {
    state.banks = banks;
  },
  [SET_COUNTRIES](state, countries) {
    state.countries = countries;
  },
  [SET_PAGE](state, page) {
    state.page = page;
  },
  [SET_PAGINATION](state, pagination) {
    state.pagination = pagination;
  }
}
export const actions = {
  async fetchBanks({
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
      banks,
      page
    } = await this.$banks.pageBanks(requestPage, size, sortBy, direction, filter);
    commit(SET_BANKS, banks);
    commit(SET_PAGE, page);
    commit(SET_PAGINATION, {
      requestPage,
      size,
      sortBy,
      descending
    })
  },
  async fetchCountries({
    commit
  }) {
    const countries = await this.$countries.listCountries();
    commit(SET_COUNTRIES, countries);
  },
  async createBank({
    dispatch
  }, {
    bank
  }) {
    await this.$banks.createBank(bank);
    await dispatch('fetchBanks');
  },
  async updateBank({
    dispatch
  }, {
    bank
  }) {
    await this.$banks.updateBank(bank);
    await dispatch('fetchBanks');
  },
  async deleteBank({
    dispatch
  }, {
    bank
  }) {
    await this.$banks.deleteBank(bank);
    await dispatch('fetchBanks');
  }
}
