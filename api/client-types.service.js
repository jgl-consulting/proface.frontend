import {
  CLIENT_TYPES_ENDPOINT
} from '@/util/endpoints';

export default class ClientTypesService {
  constructor({
    $axios
  }) {
    this.$axios = $axios;
  }
  async pageClientTypes(page, size, sortBy, direction, filter) {
    const clientTypes = await this.$axios.$get(CLIENT_TYPES_ENDPOINT, {
      params: {
        page,
        size,
        sort: sortBy ? `${sortBy},${direction}` : sortBy,
        filter
      }
    });

    const extract = (clientType) => ({
      ...clientType
    });

    return {
      clientTypes: clientTypes.content.map(extract),
      page: {
        totalElements: clientTypes.totalElements,
        totalPages: clientTypes.totalPages,
        page: clientTypes.page,
        size: clientTypes.size,
        isSorted: clientTypes.isSorted
      }
    }
  }
  async listClientTypes() {
    return await this.$axios.$get(CLIENT_TYPES_ENDPOINT, {
      params: {
        unpaged: true
      }
    });
  }
  async createClientType(clientType) {
    await this.$axios.$post(CLIENT_TYPES_ENDPOINT, clientType);
  }
  async updateClientType(clientType) {
    const {
      id
    } = clientType;
    await this.$axios.$put(`${CLIENT_TYPES_ENDPOINT}/${id}`, clientType);
  }
  async deleteClientType({
    id
  }) {
    await this.$axios.$delete(`${CLIENT_TYPES_ENDPOINT}/${id}`);
  }
}
