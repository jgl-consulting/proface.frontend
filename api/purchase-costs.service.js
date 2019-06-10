import {
  PURCHASE_COSTS_ENDPOINT
}
from '@/util/endpoints';

export default class PurchaseCostsService {
  constructor({
    $axios
  }) {
    this.$axios = $axios;
  }

  listPurchaseCosts() {
    return this.$axios.$get(PURCHASE_COSTS_ENDPOINT, {
      params: {
        unpaged: true
      }
    });
  }

  async createPurchaseCost(purchaseCost) {
    await this.$axios.$post(PURCHASE_COSTS_ENDPOINT, purchaseCost);
  }

  async updatePurchaseCost(purchaseCost) {
    const {
      id
    } = purchaseCost;
    await this.$axios.$put(`${PURCHASE_COSTS_ENDPOINT}/${id}`, purchaseCost);
  }

  async deletePurchaseCost(purchaseCost) {
    const {
      id
    } = purchaseCost;
    await this.$axios.$delete(`${PURCHASE_COSTS_ENDPOINT}/${id}`);
  }

}
