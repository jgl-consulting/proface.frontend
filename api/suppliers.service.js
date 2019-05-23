import { SUPPLIERS_ENDPOINT } from '@/util/endpoints';
export default class SuppliersService {
  constructor({ $axios }) {
    this.$axios = $axios;
  }

  async pageSuppliers(page, size, sortBy, direction) {
    const suppliers = await this.$axios.$get(SUPPLIERS_ENDPOINT, {
      params: { page, size, sort: sortBy ? `${sortBy},${direction}`: sortBy}
    });
    
    const extractOneContact = (supplier) => ({
      ...supplier,
      contacts: undefined,
      contact: supplier.contacts[0] || {}
    });

    return { 
      suppliers: suppliers.content.map(extractOneContact),
      page:  { 
        totalElements: suppliers.totalElements,
        totalPages: suppliers.totalPages,
        page: suppliers.page,
        size: suppliers.size,
        isSorted: suppliers.isSorted
      }
    }
  }

  async listSuppliers() {
    return  await this.$axios.$get(`${SUPPLIERS_ENDPOINT}/unpaged`);
  }

  getSupplierById(supplierId) {
    return this.$axios.$get(`${SUPPLIERS_ENDPOINT}/${supplierId}`);
  } 

  async createSupplier(supplier) {
    await this.$axios.$post(SUPPLIERS_ENDPOINT, supplier);
  }

  async updateSupplier(supplier) {
    const { id } = supplier;
    await this.$axios.$put(`${SUPPLIERS_ENDPOINT}/${id}`, supplier);
  }

  async deleteSupplier({ id }) {
    await this.$axios.$delete(`${SUPPLIERS_ENDPOINT}/${id}`);
  }

}