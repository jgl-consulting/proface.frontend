import {
  CURRENCIES_ENDPOINT
} from '@/util/endpoints'
export default class CurrenciesService {
  constructor({
    $axios
  }) {
    this.$axios = $axios;
  }
  async listCurrencies() {
    return await this.$axios.$get(CURRENCIES_ENDPOINT);
  }
}
