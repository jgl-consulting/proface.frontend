import {
    UNITS_ENDPOINT
  } from '@/util/endpoints';
  
  export default class UnitsService {
    constructor({
      $axios
    }) {
      this.$axios = $axios;
    }
    async pageUnits(page, size, sortBy, direction, filter) {
      const units = await this.$axios.$get(UNITS_ENDPOINT, {
        params: {
          page,
          size,
          sort: sortBy ? `${sortBy},${direction}` : sortBy,
          filter
        }
      });
  
      const extract = (unit) => ({
        ...unit
      });
  
      return {
        units: units.content.map(extract),
        page: {
          totalElements: units.totalElements,
          totalPages: units.totalPages,
          page: units.page,
          size: units.size,
          isSorted: units.isSorted
        }
      }
    }
    async listUnits() {
      return await this.$axios.$get(UNITS_ENDPOINT, {
        params: {
          unpaged: true
        }
      });
    }
    async createUnit(unit) {
      await this.$axios.$post(UNITS_ENDPOINT, unit);
    }
    async updateUnit(unit) {
      const {
        id
      } = unit;
      await this.$axios.$put(`${UNITS_ENDPOINT}/${id}`, unit);
    }
    async deleteUnit({
      id
    }) {
      await this.$axios.$delete(`${UNITS_ENDPOINT}/${id}`);
    }
  }
  