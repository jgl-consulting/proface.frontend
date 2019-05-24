import {
    SET_RECEPTION_STATUSES,
    SET_PAGE,
    SET_PAGINATION
} from '@/util/mutations-types';
import _ from 'lodash';
export const state = () => ({
    receptionStatuses: [],
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
    [SET_RECEPTION_STATUSES](state, receptionStatuses) {
        state.receptionStatuses = receptionStatuses;
    },
    [SET_PAGE](state, page) {
        state.page = page;
    },
    [SET_PAGINATION](state, pagination) {
        state.pagination = pagination;
    }
}
export const actions = {
    async fetchReceptionStatuses({ state, commit }, pagination) {
        const { requestPage, size, sortBy, descending } = pagination || state.pagination;
        const direction = descending ? 'desc' : 'asc';
        const { receptionStatuses, page } = await this.$receptionStatuses.pageReceptionStatuses(requestPage, size, sortBy, direction);
        commit(SET_RECEPTION_STATUSES, receptionStatuses);
        commit(SET_PAGE, page);
        commit(SET_PAGINATION, { requestPage, size, sortBy, descending })
    },
    async createReceptionStatus({ dispatch }, { receptionStatus }) {
        await this.$receptionStatuses.createReceptionStatus(receptionStatus);
        await dispatch('fetchReceptionStatuses');
    },
    async updateReceptionStatus({ dispatch }, { receptionStatus }) {
        await this.$receptionStatuses.updateReceptionStatus(receptionStatus);
        await dispatch('fetchReceptionStatuses');
    },
    async deleteReceptionStatus({ dispatch }, { receptionStatus }) {
        await this.$receptionStatuses.deleteReceptionStatus(receptionStatus);
        await dispatch('fetchReceptionStatuses');
    }
}