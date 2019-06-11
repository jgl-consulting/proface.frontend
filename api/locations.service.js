import {
    LOCATIONS_ENDPOINT
} from '@/util/endpoints';

export default class LocationsService {
    constructor({
        $axios
    }) {
        this.$axios = $axios;
    }
    async pageLocations(page, size, sortBy, direction, filter) {
        const locations = await this.$axios.$get(LOCATIONS_ENDPOINT, {
          params: {
            page,
            size,
            sort: sortBy ? `${sortBy},${direction}` : sortBy,
            filter
          }
        });
    
        const extract = (location) => ({
          ...location
        });
    
        return {
          locations: locations.content.map(extract),
          page: {
            totalElements: locations.totalElements,
            totalPages: locations.totalPages,
            page: locations.page,
            size: locations.size,
            isSorted: locations.isSorted
          }
        }
      }
      async listLocations() {
        return await this.$axios.$get(LOCATIONS_ENDPOINT, {
          params: {
            unpaged: true
          }
        });
      }
      async createLocation(location) {
        await this.$axios.$post(LOCATIONS_ENDPOINT, location);
      }
      async updateLocation(location) {
        const {
          id
        } = location;
        await this.$axios.$put(`${LOCATIONS_ENDPOINT}/${id}`, location);
      }
      async deleteLocation({
        id
      }) {
        await this.$axios.$delete(`${LOCATIONS_ENDPOINT}/${id}`);
      }
}