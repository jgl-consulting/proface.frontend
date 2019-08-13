import {
  SET_SUPPLIER,
  SET_BANKS,
  SET_CURRENCIES,
  SET_PURCHASE_ORDERS,
  SET_PAGE,
  SET_PAGINATION
} from '@/util/mutations-types'
export const state = () => ({
  supplier: {},
  banks: [],
  purchaseOrders: [],
  currencies: [],
  page: {
    size: 0,
    totalElements: 0,
    totalPages: 0,
    number: 0,
    sort: undefined
  },
  pagination: {
    descending: false,
    page: 1,
    rowsPerPage: 20, // -1 for All",
    sortBy: 'id'
  }
});
export const mutations = {
  [SET_SUPPLIER](state, supplier) {
    state.supplier = supplier;
  },
  [SET_BANKS](state, banks) {
    state.banks = banks;
  },
  [SET_CURRENCIES](state, currencies) {
    state.currencies = currencies;
  },
  [SET_PURCHASE_ORDERS](state, purchaseOrders) {
    state.purchaseOrders = purchaseOrders;
  },
  [SET_PAGE](state, page) {
    state.page = page;
  },
  [SET_PAGINATION](state, pagination) {
    state.pagination = pagination;
  }
}
export const actions = {
  async fetchSupplier({
    commit
  }, {
    supplierId
  }) {
    const supplier = await this.$suppliers.getSupplierById(supplierId);
    commit(SET_SUPPLIER, supplier);
    return supplier;
  },
  async createSupplierAccount({
    state,
    dispatch
  }, {
    supplierAccount
  }) {
    await this.$supplierAccounts.createSupplierAccount({
      ...supplierAccount,
      supplier: state.supplier
    });
    await dispatch('fetchSupplier', {
      supplierId: this.$_.get(state, 'supplier.id', {})
    });
  },
  async updateSupplierAccount({
    state,
    dispatch
  }, {
    supplierAccount
  }) {
    await this.$supplierAccounts.updateSupplierAccount(supplierAccount.id, {
      ...supplierAccount,
      supplier: state.supplier
    });
    await dispatch('fetchSupplier', {
      supplierId: this.$_.get(state, 'supplier.id', {})
    });
  },
  async deleteSupplierAccount({
    state,
    dispatch
  }, {
    supplierAccount
  }) {
    await this.$supplierAccounts.deleteSupplierAccount(supplierAccount);
    await dispatch('fetchSupplier', {
      supplierId: this.$_.get(state, 'supplier.id', {})
    });
  },
  async fetchBanks({
    commit
  }) {
    const banks = await this.$banks.listBanks();
    commit(SET_BANKS, banks);
  },
  async fetchCurrencies({
    commit
  }) {
    const currencies = await this.$currencies.listCurrencies();
    commit(SET_CURRENCIES, currencies);
  },
  async fetchPurchaseOrders({
    state,
    commit
  }, pagination) {
    const {
      requestPage,
      size,
      sortBy,
      descending,
      filter
    } = pagination || state.pagination;
    const direction = descending ? 'desc' : 'asc';
    const supplierId = this.$_.get(state, 'supplier.id', {});
    const supplierFilter = "supplier.id:" + supplierId;
    const completeFilter = filter? filter + supplierFilter : supplierFilter;
    const {
      purchaseOrders,
      page
    } = await this.$purchaseOrders.pagePurchaseOrders(requestPage, size, sortBy, direction, completeFilter);
    commit(SET_PURCHASE_ORDERS, purchaseOrders);
    commit(SET_PAGE, page);
    commit(SET_PAGINATION, {
      requestPage,
      size,
      sortBy,
      descending
    })
  }
}
