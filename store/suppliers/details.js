import { 
  SET_SUPPLIER
} from '@/util/mutations-types'
export const state = () => ({
  supplier: {}
});

export const mutations = {
  [SET_SUPPLIER](state, supplier){
    state.supplier = supplier;
  }
}

export const actions = {
  async fetchSupplier({commit}, { supplierId }) {
    const supplier = await this.$suppliers.getSupplierById(supplierId);
    commit(SET_SUPPLIER, supplier);
    return supplier;
  }
}