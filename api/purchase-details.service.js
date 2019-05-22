import {
  PURCHASE_DETAILS_ENDPOINT
}
  from '@/util/endpoints';

export default class PurchaseDetailsService {
  constructor({ $axios }) {
    this.$axios = $axios;
  }

  listPurchaseDetails() {
    return this.$axios.$get(`${PURCHASE_DETAILS_ENDPOINT}/unpaged`);
  }


  async createPurchaseDetail(purchaseDetail) {
    await this.$axios.$post(PURCHASE_DETAILS_ENDPOINT, purchaseDetail);
  }

  async updatePurchaseDetail(purchaseDetail) {
    const { product, purchase } = purchaseDetail;
    await this.$axios.$put(`${PURCHASE_DETAILS_ENDPOINT}/product/${product.id}/purchase/${purchase.id}`, purchaseDetail);
  }

  async deletePurchaseDetail(purchaseDetail) {
    const { product, purchase } = purchaseDetail;
    await this.$axios.$delete(`${PURCHASE_DETAILS_ENDPOINT}/product/${product.id}/purchase/${purchase.id}`);
  }

}