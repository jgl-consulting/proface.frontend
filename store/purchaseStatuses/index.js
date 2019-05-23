import {
    SET_PURCHASE_STATUSES,
    SET_PAGE,
    SET_PAGINATION
} from '@/util/mutations-types';
import _ from 'lodash';
export const state = () => ({
    purchaseStatuses: [],
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
    [SET_PURCHASE_STATUSES](state, purchaseStatuses) {
        state.purchaseStatuses = purchaseStatuses;
    },
    [SET_PAGE](state, page) {
        state.page = page;
    },
    [SET_PAGINATION](state, pagination) {
        state.pagination = pagination;
    }
}
export const actions = {
    async fetchPurchaseStatuses({ state, commit }, pagination) {
        const { requestPage, size, sortBy, descending } = pagination || state.pagination;
        const direction = descending ? 'desc' : 'asc';
        const { purchaseStatuses, page } = await this.$purchaseStatuses.pagePurchaseStatuses(requestPage, size, sortBy, direction);
        commit(SET_PURCHASE_STATUSES, purchaseStatuses);
        commit(SET_PAGE, page);
        commit(SET_PAGINATION, { requestPage, size, sortBy, descending })
    },
    async createPurchaseStatus({ dispatch }, { purchaseStatus }) {
        await this.$purchaseStatuses.createPurchaseStatus(purchaseStatus);
        await dispatch('fetchPurchaseStatuses');
    },
    async updatePurchaseStatus({ dispatch }, { purchaseStatus }) {
        await this.$purchaseStatuses.updatePurchaseStatus(purchaseStatus);
        await dispatch('fetchPurchaseStatuses');
    },
    async deletePurchaseStatus({ dispatch }, { purchaseStatus }) {
        await this.$purchaseStatuses.deletePurchaseStatus(purchaseStatus);
        await dispatch('fetchPurchaseStatuses');
    }
}