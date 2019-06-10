import {
  PURCHASE_STATUSES_ENDPOINT
} from '@/util/endpoints';
export default class PurchaseStatusesService {
  constructor({
    $axios
  }) {
    this.$axios = $axios;
  }
  async pagePurchaseStatuses(page, size, sortBy, direction, filter) {
    const purchaseStatuses = await this.$axios.$get(PURCHASE_STATUSES_ENDPOINT, {
      params: {
        page,
        size,
        sort: sortBy ? `${sortBy},${direction}` : sortBy,
        filter
      }
    });
    const extract = (purchaseStatus) => ({
      ...purchaseStatus
    });
    return {
      purchaseStatuses: purchaseStatuses.content.map(extract),
      page: {
        totalElements: purchaseStatuses.totalElements,
        totalPages: purchaseStatuses.totalPages,
        page: purchaseStatuses.page,
        size: purchaseStatuses.size,
        isSorted: purchaseStatuses.isSorted
      }
    }
  }
  async listPurchaseStatuses() {
    return await this.$axios.$get(PURCHASE_STATUSES_ENDPOINT, {
      params: {
        unpaged: true
      }
    });
  }
  async createPurchaseStatus(purchaseStatus) {
    await this.$axios.$post(PURCHASE_STATUSES_ENDPOINT, purchaseStatus);
  }
  async updatePurchaseStatus(purchaseStatus) {
    const {
      id
    } = purchaseStatus;
    await this.$axios.$put(`${PURCHASE_STATUSES_ENDPOINT}/${id}`, purchaseStatus);
  }
  async deletePurchaseStatus({
    id
  }) {
    await this.$axios.$delete(`${PURCHASE_STATUSES_ENDPOINT}/${id}`);
  }

}
