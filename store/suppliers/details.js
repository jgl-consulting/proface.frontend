import { 
  SET_SUPPLIER,
  SET_BANKS
} from '@/util/mutations-types'
export const state = () => ({
  supplier: {},
  banks: []
});

export const mutations = {
  [SET_SUPPLIER](state, supplier){
    state.supplier = supplier;
  },
  [SET_BANKS](state, banks) {
    state.banks = banks;
  }
}

export const actions = {
  async fetchSupplier({commit}, { supplierId }) {
    const supplier = await this.$suppliers.getSupplierById(supplierId);
    commit(SET_SUPPLIER, supplier);
    return supplier;
  },
  async createSupplierAccount({ state, dispatch }, { supplierAccount }) {
    
    await this.$supplierAccounts.createSupplierAccount({
      ...supplierAccount,
      supplier: state.supplier
    });
    await dispatch('fetchSupplier', { supplierId: this.$_.get(state, 'supplier.id', { })});
  },
  async updateSupplierAccount({ state, dispatch }, { supplierAccount }) {
    
    await this.$supplierAccounts.updateSupplierAccount(supplierAccount.id, {
      ...supplierAccount,
      supplier: state.supplier
    });
    await dispatch('fetchSupplier', { supplierId: this.$_.get(state, 'supplier.id', { })});
  },
  async deleteSupplierAccount({ state, dispatch }, { supplierAccount }) {
    
    await this.$supplierAccounts.deleteSupplierAccount(supplierAccount);
    await dispatch('fetchSupplier', { supplierId: this.$_.get(state, 'supplier.id', { })});
  },
  async fetchBanks({commit}) {
    const banks = await this.$banks.listBanks();
    commit(SET_BANKS, banks);
  },
}