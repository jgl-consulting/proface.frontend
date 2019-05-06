import { SUPPLIERS_ENDPOINT } from '@/util/endpoints';

export default class SuppliersService {
  constructor({ $axios }) {
    this.$axios = $axios;
  }

  async listSuppliers(page, size, sortBy, descending) {
    const suppliers = await this.$axios.$get(SUPPLIERS_ENDPOINT, {
      params: { page, size, sortBy, descending }
    });
    
    const extractOneContact = (supplier) => ({
      ...supplier,
      contacts: undefined,
      contact: supplier.contacts[0]
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

}