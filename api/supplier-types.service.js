import {
  SUPPLIER_TYPES_ENDPOINT
} from '@/util/endpoints';
export default class SupplierTypesService {
  constructor({
    $axios
  }) {
    this.$axios = $axios;
  }

  listSupplierTypes() {
    return this.$axios.$get(SUPPLIER_TYPES_ENDPOINT, {
      params: {
        unpaged: true
      }
    });
  }
}
