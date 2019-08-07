import {
  SALE_INVOICES_ENDPOINT
}
from '@/util/endpoints';

export default class SaleInvoicesService {
  constructor({
    $axios
  }) {
    this.$axios = $axios;
  }

  listSaleInvoices() {
    return this.$axios.$get(SALE_INVOICES_ENDPOINT, {
      params: {
        unpaged: true
      }
    });
  }

  async createSaleInvoice(saleInvoice) {
    await this.$axios.$post(SALE_INVOICES_ENDPOINT, saleInvoice);
  }

  async updateSaleInvoice(saleInvoice) {
    const {
      id
    } = saleInvoice;
    await this.$axios.$put(`${SALE_INVOICES_ENDPOINT}/${id}`, saleInvoice);
  }

  async deleteSaleInvoice(saleInvoice) {
    const {
      id
    } = saleInvoice;
    await this.$axios.$delete(`${SALE_INVOICES_ENDPOINT}/${id}`);
  }

}
