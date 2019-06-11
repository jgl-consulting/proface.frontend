import {
    BATCH_TYPES_ENDPOINT
} from '@/util/endpoints';

export default class BatchTypesService {
    constructor({
        $axios
    }) {
        this.$axios = $axios;
    }
    async pageBatchTypes(page, size, sortBy, direction, filter) {
        const batchTypes = await this.$axios.$get(BATCH_TYPES_ENDPOINT, {
          params: {
            page,
            size,
            sort: sortBy ? `${sortBy},${direction}` : sortBy,
            filter
          }
        });
    
        const extract = (batchType) => ({
          ...batchType
        });
    
        return {
          batchTypes: batchTypes.content.map(extract),
          page: {
            totalElements: batchTypes.totalElements,
            totalPages: batchTypes.totalPages,
            page: batchTypes.page,
            size: batchTypes.size,
            isSorted: batchTypes.isSorted
          }
        }
      }
      async listBatchTypes() {
        return await this.$axios.$get(BATCH_TYPES_ENDPOINT, {
          params: {
            unpaged: true
          }
        });
      }
      async createBatchType(batchType) {
        await this.$axios.$post(BATCH_TYPES_ENDPOINT, batchType);
      }
      async updateBatchType(batchType) {
        const {
          id
        } = batchType;
        await this.$axios.$put(`${BATCH_TYPES_ENDPOINT}/${id}`, batchType);
      }
      async deleteBatchType({
        id
      }) {
        await this.$axios.$delete(`${BATCH_TYPES_ENDPOINT}/${id}`);
      }
}