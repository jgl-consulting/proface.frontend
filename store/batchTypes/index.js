import {
    SET_BATCH_TYPES,
    SET_PAGE,
    SET_PAGINATION
} from '@/util/mutations-types';
import _ from 'lodash';
export const state = () => ({
    batchTypes: [],
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
    [SET_BATCH_TYPES](state, batchTypes) {
        state.batchTypes = batchTypes;
    },
    [SET_PAGE](state, page) {
        state.page = page;
    },
    [SET_PAGINATION](state, pagination) {
        state.pagination = pagination;
    }
}
export const actions = {
    async fetchBatchTypes({ state, commit }, pagination) {
        const { requestPage, size, sortBy, descending } = pagination || state.pagination;
        const direction = descending ? 'desc' : 'asc';
        const { batchTypes, page } = await this.$batchTypes.pageBatchTypes(requestPage, size, sortBy, direction);
        commit(SET_BATCH_TYPES, batchTypes);
        commit(SET_PAGE, page);
        commit(SET_PAGINATION, { requestPage, size, sortBy, descending })
    },
    async createBatchType({ dispatch }, { batchType }) {
        await this.$batchTypes.createBatchType(batchType);
        await dispatch('fetchBatchTypes');
    },
    async updateBatchType({ dispatch }, { batchType }) {
        await this.$batchTypes.updateBatchType(batchType);
        await dispatch('fetchBatchTypes');
    },
    async deleteBatchType({ dispatch }, { batchType }) {
        await this.$batchTypes.deleteBatchType(batchType);
        await dispatch('fetchBatchTypes');
    }
}