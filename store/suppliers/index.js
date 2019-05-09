import { SET_SUPPLIERS, SET_SUPPLIER_TYPES, SET_PAGE } from '@/util/mutations-types';
import _ from 'lodash';
export const state = () => ({
  suppliers: [],
  supplierTypes: [],
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
  }
}
export const actions = {
  async fetchSuppliers({ commit }, { requestPage, size, sortBy, descending }) {
    const { suppliers, page } = await this.$suppliers.listSuppliers(requestPage, size, sortBy, descending);
    commit(SET_SUPPLIERS, suppliers);
    commit(SET_PAGE, page);
  },
  async fetchSupplierTypes({ commit }) {
    const supplierTypes = await this.$suppliers.listSupplierTypes();
    commit(SET_SUPPLIER_TYPES, supplierTypes.map((type) => {
      const url = new URL(type._links.self.href);
      const id = parseInt(_.last(url.pathname.split('/')));
      return { id,...type };
    }));
  }
}