import { 
    SET_PRODUCTS,
    SET_PRODUCT_LINES, 
    SET_PAGE,
    SET_PAGINATION
} from '@/util/mutations-types';
import _ from 'lodash';
export const state = () => ({
  products: [],
  productLines: [],
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
  [SET_PRODUCT_LINES](state, productLines){
    state.productLines = productLines;
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
  },
  async fetchProductLines({ commit }) {
    const productLines = await this.$productLines.listProductLines();
    commit(SET_PRODUCT_LINES, productLines);
  },
  async createProduct({ dispatch }, { product }) {
    await this.$products.createProduct(product);
    await dispatch('fetchProducts');
  },
  async updateProduct({ dispatch }, { product }) {
    await this.$products.updateProduct(product);
    await dispatch('fetchProducts');
  },
  async deleteProduct({ dispatch }, { product }) {
    await this.$products.deleteProduct(product);
    await dispatch('fetchProducts');
  }
}