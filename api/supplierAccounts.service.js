import { SUPPLIER_ACCOUNT_ENDPOINT } from '@/util/endpoints';

export default class SupplierAccountsService {
  constructor({ $axios }) {
    this.$axios = $axios;
  }

  listSupplierAccounts() {
    return this.$axios.$get(`${SUPPLIER_ACCOUNT_ENDPOINT}/unpaged`);
  }

  /* getSupplierById(supplierId) {
    return this.$axios.$get(`${SUPPLIER_ACCOUNT_ENDPOINT}/${supplierId}`);
  }  */

  async createSupplierAccount(supplierAccount) {
    await this.$axios.$post(SUPPLIER_ACCOUNT_ENDPOINT,  supplierAccount);
  }

  async updateSupplierAccount(supplierId, supplierAccount) {
    await this.$axios.$put(`${SUPPLIER_ACCOUNT_ENDPOINT}/${supplierId}`, supplierAccount);
  }

  async deleteSupplierAccount({ id }) {
    await this.$axios.$delete(`${SUPPLIER_ACCOUNT_ENDPOINT}/${id}`);
  }

}