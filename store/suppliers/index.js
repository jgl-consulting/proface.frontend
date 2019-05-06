import { SET_SUPPLIERS, SET_PAGE } from '@/util/mutations-types';

export const state = () => ({
  suppliers: [],
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
  [SET_PAGE](state, page) {
    state.page = page;
  }
}
export const actions = {
  async fetchSuppliers({ commit }, { requestPage, size, sortBy, descending }) {
    const { suppliers, page } = await this.$suppliers.listSuppliers(requestPage, size, sortBy, descending);
    commit(SET_SUPPLIERS, suppliers);
    commit(SET_PAGE, page);
  }
}