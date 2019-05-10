import { SET_SUPPLIERS, SET_SUPPLIER_TYPES, SET_PAGE, SET_COUNTRIES } from '@/util/mutations-types';
import _ from 'lodash';
export const state = () => ({
  suppliers: [],
  supplierTypes: [],
  countries: [],
  page: {
    size: 0,
    totalElements: 0,
    totalPages: 0,
    number: 0,
    sort: undefined
  }
})

export const mutations = {
  [SET_SUPPLIERS](state, suppliers){
    state.suppliers = suppliers;
  },
  [SET_SUPPLIER_TYPES](state, supplierTypes){
    state.supplierTypes = supplierTypes;
  },
  [SET_PAGE](state, page) {
    state.page = page;
  },
  [SET_COUNTRIES](state, countries) {
    state.countries = countries;
  }
}
export const actions = {
  async fetchSuppliers({ commit }, { requestPage, size, sortBy, descending }) {
    const direction = descending ? 'desc' : 'asc';
    const { suppliers, page } = await this.$suppliers.listSuppliers(requestPage, size, sortBy, direction);
    commit(SET_SUPPLIERS, suppliers);
    commit(SET_PAGE, page);
  },
  async fetchSupplierTypes({ commit }) {
    const supplierTypes = await this.$suppliers.listSupplierTypes();
    commit(SET_SUPPLIER_TYPES, supplierTypes);
  },
  async fetchCountries({commit}) {
    const countries = await this.$countries.listCountries();
    commit(SET_COUNTRIES, countries);
  },
  async createSupplier({ dispatch }, { supplier }) {
    await this.$suppliers.createSupplier(supplier);
    await dispatch('fetchSuppliers');
  }
}