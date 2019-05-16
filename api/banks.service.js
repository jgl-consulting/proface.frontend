import { BANKS_ENDPOINT } from '@/util/endpoints';
export default class BanksService {
  
  constructor({ $axios }) {
    this.$axios = $axios;
  }

  async listBanks() {
    return this.$axios.$get(`${BANKS_ENDPOINT}/unpaged`);
  }

}