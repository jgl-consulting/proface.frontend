import {
  BANKS_ENDPOINT
} from '@/util/endpoints';
export default class BanksService {
  constructor({
    $axios
  }) {
    this.$axios = $axios;
  }
  async pageBanks(page, size, sortBy, direction, filter) {
    const banks = await this.$axios.$get(BANKS_ENDPOINT, {
      params: {
        page,
        size,
        sort: sortBy ? `${sortBy},${direction}` : sortBy,
        filter
      }
    });

    const extract = (bank) => ({
      ...bank
    });

    return {
      banks: banks.content.map(extract),
      page: {
        totalElements: banks.totalElements,
        totalPages: banks.totalPages,
        page: banks.page,
        size: banks.size,
        isSorted: banks.isSorted
      }
    }
  }
  async listBanks() {
    return await this.$axios.$get(BANKS_ENDPOINT, {
      params: {
        unpaged: true
      }
    });
  }
  async createBank(bank) {
    await this.$axios.$post(BANKS_ENDPOINT, bank);
  }
  async updateBank(bank) {
    const {
      id
    } = bank;
    await this.$axios.$put(`${BANKS_ENDPOINT}/${id}`, bank);
  }
  async deleteBank({
    id
  }) {
    await this.$axios.$delete(`${BANKS_ENDPOINT}/${id}`);
  }
}
