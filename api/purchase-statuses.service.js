import { PURCHASE_STATUSES_ENDPOINT } from '@/util/endpoints';
export default class PurchaseStatusesService {
    constructor({ $axios }) {
        this.$axios = $axios;
    }

    listPurchaseStatuses() {
        return this.$axios.$get(`${PURCHASE_STATUSES_ENDPOINT}/unpaged`);
    }
}