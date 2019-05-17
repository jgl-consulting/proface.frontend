import { 
  SET_SUPPLIER,
  SET_BANKS
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
  },
  async createSupplierAccount({ dispatch }, { supplierAccount }) {
    await this.$supplierAccounts.createSupplierAccount(supplierAccount);
    await dispatch('fetchSupplierAccount');
  },
  async updateSupplierAccount({ dispatch }, { supplierAccount }) {
    await this.$supplierAccounts.updateSupplierAccount(supplierAccount);
    await dispatch('fetchSupplierAccount');
  },
  async fetchBanks({commit}) {
    const banks = await this.$banks.listBanks();
    commit(SET_BANKS, banks);
  },
}