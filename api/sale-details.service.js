import {
  SALE_DETAILS_ENDPOINT
}
from '@/util/endpoints';

export default class SaleDetailsService {
  constructor({
    $axios
  }) {
    this.$axios = $axios;
  }

  listSaleDetails() {
    return this.$axios.$get(SALE_DETAILS_ENDPOINT, {
      params: {
        unpaged: true
      }
    });
  }

  async createSaleDetail(saleDetail) {
    await this.$axios.$post(SALE_DETAILS_ENDPOINT, saleDetail);
  }

  async updateSaleDetail(saleDetail) {
    const {
      product,
      sale
    } = saleDetail;
    await this.$axios.$put(`${SALE_DETAILS_ENDPOINT}?productId=${product.id}&saleId=${sale.id}`, saleDetail);
  }

  async deleteSaleDetail(saleDetail) {
    const {
      product,
      sale
    } = saleDetail;
    await this.$axios.$delete(`${SALE_DETAILS_ENDPOINT}?productId=${product.id}&saleId=${sale.id}`);
  }

}
