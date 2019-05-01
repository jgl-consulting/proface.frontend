import { SET_PROVEEDORES, SET_PAGE } from '@/util/mutations-types';

export const state = () => ({
  proveedores: [],
  page: {
    size: 0,
    totalElements: 0,
    totalPages: 0,
    number: 0,
    sort: undefined
  }
})

export const mutations = {
  [SET_PROVEEDORES](state, proveedores){
    state.proveedores = proveedores;
  },
  [SET_PAGE](state, page) {
    state.page = page;
  }
}
export const actions = {
  async fetchProveedores({ commit }, { requestPage, size, sortBy, descending }) {
    let direction = descending ? 'desc' : 'asc'
    const { proveedores, page } = await this.$proveedores.listProveedores(requestPage, size, sortBy, direction);
    commit(SET_PROVEEDORES, proveedores);
    commit(SET_PAGE, page);
  }
}
