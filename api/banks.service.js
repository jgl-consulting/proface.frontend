import { BANKS_ENDPOINT } from '@/util/endpoints';
export default class BanksService {
  constructor({ $axios }) {
    this.$axios = $axios;
  }

  listBanks() {
    return this.$axios.$get(`${BANKS_ENDPOINT}/unpaged`);
  }

}