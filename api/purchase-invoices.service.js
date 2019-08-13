import {
  PURCHASE_INVOICES_ENDPOINT
}
from '@/util/endpoints';

export default class PurchaseInvoicesService {
  constructor({
    $axios
  }) {
    this.$axios = $axios;
  }

  listPurchaseInvoices() {
    return this.$axios.$get(PURCHASE_INVOICES_ENDPOINT, {
      params: {
        unpaged: true
      }
    });
  }

  async createPurchaseInvoice(purchaseInvoice) {
    await this.$axios.$post(PURCHASE_INVOICES_ENDPOINT, purchaseInvoice);
  }

  async updatePurchaseInvoice(purchaseInvoice) {
    const {
      id
    } = purchaseInvoice;
    await this.$axios.$put(`${PURCHASE_INVOICES_ENDPOINT}/${id}`, purchaseInvoice);
  }

  async deletePurchaseInvoice(purchaseInvoice) {
    const {
      id
    } = purchaseInvoice;
    await this.$axios.$delete(`${PURCHASE_INVOICES_ENDPOINT}/${id}`);
  }

}
