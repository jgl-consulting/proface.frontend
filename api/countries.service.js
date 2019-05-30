import { COUNTRIES_ENDPOINT } from '@/util/endpoints';
export default class CountriesService {
  constructor({ $axios }) {
    this.$axios = $axios;
  }

  async listCountries() {
    return await this.$axios.$get(COUNTRIES_ENDPOINT);
  }

}