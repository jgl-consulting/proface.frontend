import { PURCHASE_DETAILS_ENDPOINT, RECEPTION_STATUSES_ENDPOINT } from '@/util/endpoints';

export default class PurchaseDetailsService {
  constructor({ $axios }) {
    this.$axios = $axios;
  }

  listPurchaseDetails() {
    return this.$axios.$get(`${PURCHASE_DETAILS_ENDPOINT}/unpaged`);
  }

  listReceptionStatuses() {
    return this.$axios.$get(`${RECEPTION_STATUSES_ENDPOINT}/unpaged`);
  }

  async createPurchaseDetail(purchaseDetail) {
    await this.$axios.$post(PURCHASE_DETAILS_ENDPOINT,  purchaseDetail);
  }

  async updatePurchaseDetail(purchaseDetailId, purchaseDetail) {
    await this.$axios.$put(`${PURCHASE_DETAILS_ENDPOINT}/${purchaseDetailId}`, purchaseDetail);
  }

  async deletePurchaseDetail({ id }) {
    await this.$axios.$delete(`${PURCHASE_DETAILS_ENDPOINT}/${id}`);
  }

}