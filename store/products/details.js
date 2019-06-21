import {
  SET_PRODUCT,
  SET_UNITS,
  SET_PAGE,
  SET_PAGINATION
} from '@/util/mutations-types'
export const state = () => ({
  product: {},
  units: [],
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
});

export const mutations = {
  [SET_PRODUCT](state, product) {
    state.product = product;
  },
  [SET_UNITS](state, units) {
    state.units = units;
  },
  [SET_PAGE](state, page) {
    state.page = page;
  },
  [SET_PAGINATION](state, pagination) {
    state.pagination = pagination;
  }
}

export const actions = {

  async fetchProduct({
    commit
  }, {
    productId
  }) {
    const product = await this.$products.getProductById(productId);
    commit(SET_PRODUCT, product);
    return product;
  },

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
    const productId = this.$_.get(state, 'product.id', {});
    const productFilter = "product.id:" + productId;
    const completeFilter = filter ? filter + productFilter : productFilter;
    const {
      units,
      page
    } = await this.$units.pageUnits(requestPage, size, sortBy, direction, completeFilter);
    commit(SET_UNITS, units);
    commit(SET_PAGE, page);
    commit(SET_PAGINATION, {
      requestPage,
      size,
      sortBy,
      descending
    })
  },
}
