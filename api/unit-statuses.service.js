import {
  UNIT_STATUSES_ENDPOINT
} from '@/util/endpoints';

export default class UnitStatusesService {
  constructor({
    $axios
  }) {
    this.$axios = $axios;
  }
  async pageUnitStatuses(page, size, sortBy, direction, filter) {
    const unitStatuses = await this.$axios.$get(UNIT_STATUSES_ENDPOINT, {
      params: {
        page,
        size,
        sort: sortBy ? `${sortBy},${direction}` : sortBy,
        filter
      }
    });

    const extract = (unitStatus) => ({
      ...unitStatus
    });

    return {
      unitStatuses: unitStatuses.content.map(extract),
      page: {
        totalElements: unitStatuses.totalElements,
        totalPages: unitStatuses.totalPages,
        page: unitStatuses.page,
        size: unitStatuses.size,
        isSorted: unitStatuses.isSorted
      }
    }
  }
  async listUnitStatuses() {
    return await this.$axios.$get(UNIT_STATUSES_ENDPOINT, {
      params: {
        unpaged: true
      }
    });
  }
  async createUnitStatus(unitStatus) {
    await this.$axios.$post(UNIT_STATUSES_ENDPOINT, unitStatus);
  }
  async updateUnitStatus(unitStatus) {
    const {
      id
    } = unitStatus;
    await this.$axios.$put(`${UNIT_STATUSES_ENDPOINT}/${id}`, unitStatus);
  }
  async deleteUnitStatus({
    id
  }) {
    await this.$axios.$delete(`${UNIT_STATUSES_ENDPOINT}/${id}`);
  }
}
