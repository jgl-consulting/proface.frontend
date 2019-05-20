import { 
  SET_PRODUCTS,
  SET_PAGE,
  SET_PAGINATION
} from '@/util/mutations-types';
import _ from 'lodash';
export const state = () => ({
  products: [],
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
  [SET_PRODUCTS](state, products){
    state.products = products;
  },
  [SET_PAGE](state, page) {
    state.page = page;
  },
  [SET_PAGINATION](state, pagination) {
    state.pagination = pagination;
  }
}
export const actions = {
  async fetchProducts({ state, commit }, pagination) {
    const { requestPage, size, sortBy, descending } = pagination || state.pagination;
    const direction = descending ? 'desc' : 'asc';
    const { products, page } = await this.$products.listProducts(requestPage, size, sortBy, direction);
    commit(SET_PRODUCTS, products);
    commit(SET_PAGE, page);
    commit(SET_PAGINATION, { requestPage, size, sortBy, descending })
  }
}