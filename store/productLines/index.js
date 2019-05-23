import {
    SET_PRODUCT_LINES,
    SET_PAGE,
    SET_PAGINATION
} from '@/util/mutations-types';
import _ from 'lodash';
export const state = () => ({
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
    [SET_PRODUCT_LINES](state, productLines) {
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
    async fetchProductLines({ state, commit }, pagination) {
        const { requestPage, size, sortBy, descending } = pagination || state.pagination;
        const direction = descending ? 'desc' : 'asc';
        const { productLines, page } = await this.$productLines.pageProductLines(requestPage, size, sortBy, direction);
        commit(SET_PRODUCT_LINES, productLines);
        commit(SET_PAGE, page);
        commit(SET_PAGINATION, { requestPage, size, sortBy, descending })
    },
    async createProductLine({ dispatch }, { productLine }) {
        await this.$productLines.createProductLine(productLine);
        await dispatch('fetchProductLines');
    },
    async updateProductLine({ dispatch }, { productLine }) {
        await this.$productLines.updateProductLine(productLine);
        await dispatch('fetchProductLines');
    },
    async deleteProductLine({ dispatch }, { productLine }) {
        await this.$productLines.deleteProductLine(productLine);
        await dispatch('fetchProductLines');
    }
}