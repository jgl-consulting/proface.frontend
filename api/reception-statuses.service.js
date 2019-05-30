import { RECEPTION_STATUSES_ENDPOINT } from '@/util/endpoints';
export default class ReceptionStatusesService {
  constructor({ $axios }) {
    this.$axios = $axios;
  }
  async pageReceptionStatuses(page, size, sortBy, direction) {
    const receptionStatuses = await this.$axios.$get(RECEPTION_STATUSES_ENDPOINT,
      {
        params: { page, size, sort: sortBy ? `${sortBy},${direction}` : sortBy }
      });
    const extract = (receptionStatus) => ({
      ...receptionStatus
    });
    return {
      receptionStatuses: receptionStatuses.content.map(extract),
      page: {
        totalElements: receptionStatuses.totalElements,
        totalPages: receptionStatuses.totalPages,
        page: receptionStatuses.page,
        size: receptionStatuses.size,
        isSorted: receptionStatuses.isSorted
      }
    }
  }
  async listReceptionStatuses() {
    return await this.$axios.$get(RECEPTION_STATUSES_ENDPOINT, {
      params: { unpaged: true }
    });
  }
  async createReceptionStatus(receptionStatus) {
    await this.$axios.$post(RECEPTION_STATUSES_ENDPOINT, receptionStatus);
  }
  async updateReceptionStatus(receptionStatus) {
    const { id } = receptionStatus;
    await this.$axios.$put(`${RECEPTION_STATUSES_ENDPOINT}/${id}`, receptionStatus);
  }
  async deleteReceptionStatus({ id }) {
    await this.$axios.$delete(`${RECEPTION_STATUSES_ENDPOINT}/${id}`);
  }
}