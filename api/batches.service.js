import {
  BATCHES_ENDPOINT
} from '@/util/endpoints';

export default class BatchesService {
  constructor({
    $axios
  }) {
    this.$axios = $axios;
  }
  async pageBatches(page, size, sortBy, direction, filter) {
    const batches = await this.$axios.$get(BATCHES_ENDPOINT, {
      params: {
        page,
        size,
        sort: sortBy ? `${sortBy},${direction}` : sortBy,
        filter
      }
    });

    const extract = (batch) => ({
      ...batch
    });

    return {
      batches: batches.content.map(extract),
      page: {
        totalElements: batches.totalElements,
        totalPages: batches.totalPages,
        page: batches.page,
        size: batches.size,
        isSorted: batches.isSorted
      }
    }
  }
  async listBatches() {
    return await this.$axios.$get(BATCHES_ENDPOINT, {
      params: {
        unpaged: true
      }
    });
  }
  async createBatch(batch) {
    await this.$axios.$post(BATCHES_ENDPOINT, batch);
  }
  async updateBatch(batch) {
    const {
      id
    } = batch;
    await this.$axios.$put(`${BATCHES_ENDPOINT}/${id}`, batch);
  }
  async deleteBatch({
    id
  }) {
    await this.$axios.$delete(`${BATCHES_ENDPOINT}/${id}`);
  }
}
