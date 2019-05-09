import { COUNTRIES_ENDPOINT } from '@/util/endpoints';
export default class CountriesService {
  constructor({ $axios }) {
    this.$axios = $axios;
  }

  async listCountries() {
    const { countries } = await this.$axios.$get(`${COUNTRIES_ENDPOINT}/unpaged`);
    return countries;
  }

}