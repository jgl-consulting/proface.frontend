import {
  SALE_STATUSES_ENDPOINT
} from '@/util/endpoints';
export default class SaleStatusesService {
  constructor({
    $axios
  }) {
    this.$axios = $axios;
  }
  async pageSaleStatuses(page, size, sortBy, direction, filter) {
    const saleStatuses = await this.$axios.$get(SALE_STATUSES_ENDPOINT, {
      params: {
        page,
        size,
        sort: sortBy ? `${sortBy},${direction}` : sortBy,
        filter
      }
    });
    const extract = (saleStatus) => ({
      ...saleStatus
    });
    return {
      saleStatuses: saleStatuses.content.map(extract),
      page: {
        totalElements: saleStatuses.totalElements,
        totalPages: saleStatuses.totalPages,
        page: saleStatuses.page,
        size: saleStatuses.size,
        isSorted: saleStatuses.isSorted
      }
    }
  }
  async listSaleStatuses() {
    return await this.$axios.$get(SALE_STATUSES_ENDPOINT, {
      params: {
        unpaged: true
      }
    });
  }
  async createSaleStatus(saleStatus) {
    await this.$axios.$post(SALE_STATUSES_ENDPOINT, saleStatus);
  }
  async updateSaleStatus(saleStatus) {
    const {
      id
    } = saleStatus;
    await this.$axios.$put(`${SALE_STATUSES_ENDPOINT}/${id}`, saleStatus);
  }
  async deleteSaleStatus({
    id
  }) {
    await this.$axios.$delete(`${SALE_STATUSES_ENDPOINT}/${id}`);
  }

}
