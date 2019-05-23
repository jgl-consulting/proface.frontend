import { 
  SET_SUPPLIERS,
  SET_SUPPLIER_TYPES, 
  SET_PAGE, 
  SET_COUNTRIES,
  SET_PAGINATION
} from '@/util/mutations-types';
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
  },
  pagination: {
    descending: false,
    page: 1,
    rowsPerPage: 20,// -1 for All",
    sortBy: 'id'
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
  [SET_PAGINATION](state, pagination) {
    state.pagination = pagination;
  },
  [SET_COUNTRIES](state, countries) {
    state.countries = countries;
  }
}
export const actions = {
  async fetchSuppliers({ state, commit }, pagination) {
    const { requestPage, size, sortBy, descending } = pagination || state.pagination;
    const direction = descending ? 'desc' : 'asc';
    const { suppliers, page } = await this.$suppliers.pageSuppliers(requestPage, size, sortBy, direction);
    commit(SET_SUPPLIERS, suppliers);
    commit(SET_PAGE, page);
    commit(SET_PAGINATION, { requestPage, size, sortBy, descending })
  },
  async fetchSupplierTypes({ commit }) {
    const supplierTypes = await this.$supplierTypes.listSupplierTypes();
    commit(SET_SUPPLIER_TYPES, supplierTypes);
  },
  async fetchCountries({commit}) {
    const countries = await this.$countries.listCountries();
    commit(SET_COUNTRIES, countries);
  },
  async createSupplier({ dispatch }, { supplier }) {
    await this.$suppliers.createSupplier(supplier);
    await dispatch('fetchSuppliers');
  },
  async updateSupplier({ dispatch }, { supplier }) {
    await this.$suppliers.updateSupplier(supplier);
    await dispatch('fetchSuppliers');
  },
  async deleteSupplier({ dispatch }, { supplier }) {
    await this.$suppliers.deleteSupplier(supplier);
    await dispatch('fetchSuppliers');
  }
}