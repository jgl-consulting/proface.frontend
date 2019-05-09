import { COUNTRIES_ENDPOINT } from '@/util/endpoints';
export default class CountriesService {
  constructor({ $axios }) {
    this.$axios = $axios;
  }

  async listCountries() {
    const { supplierTypes } = (await this.$axios.$get(COUNTRIES_ENDPOINT, {
      params: { size: Number.MAX_VALUE }
    }))._embedded;

    return countries;
  }

}