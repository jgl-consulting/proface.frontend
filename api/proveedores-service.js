import { PROVEEDORES_ENDPOINT } from '@/util/endpoints';

export default class ProveedorService {
  constructor({ $axios }) {
    this.$axios = $axios;
  }

  async listProveedores(page, size, sort, direction) {
    const proveedores = await this.$axios.$get(PROVEEDORES_ENDPOINT, {
      params: { page, size, sort: `${sort},${direction}` }
    });

    return { 
      proveedores: proveedores._embedded.proveedor,
      page:  { ...proveedores.page, sort }
    }
  }

}