import { SUPPLIER_ACCOUNTS_ENDPOINT, BANKS_ENDPOINT } from '@/util/endpoints';

export default class SupplierAccountsService {
  constructor({ $axios }) {
    this.$axios = $axios;
  }

  listSupplierAccounts() {
    return this.$axios.$get(`${SUPPLIER_ACCOUNTS_ENDPOINT}/unpaged`);
  }

  async createSupplierAccount(supplierAccount) {
    await this.$axios.$post(SUPPLIER_ACCOUNTS_ENDPOINT,  supplierAccount);
  }

  async updateSupplierAccount(supplierAccountId, supplierAccount) {
    await this.$axios.$put(`${SUPPLIER_ACCOUNTS_ENDPOINT}/${supplierAccountId}`, supplierAccount);
  }

  async deleteSupplierAccount({ id }) {
    await this.$axios.$delete(`${SUPPLIER_ACCOUNTS_ENDPOINT}/${id}`);
  }

}