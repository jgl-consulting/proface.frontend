import { 
    SET_BATCH,
    SET_PRODUCTS,
    SET_LOCATIONS,
    SET_UNIT_STATUSES
  } from '@/util/mutations-types'
  export const state = () => ({
    batch: {},
    products: [],
    locations: [],
    unitStatuses: []
  });
  
  export const mutations = {
    [SET_BATCH](state, batch){
      state.batch = batch;
    },
    [SET_UNIT_STATUSES](state, unitStatuses){
      state.unitStatuses = unitStatuses;
    },
    [SET_LOCATIONS](state, locations){
      state.locations = locations;
    },
    [SET_PRODUCTS](state, products){
      state.products = products;
    }
  }
  
  export const actions = {
    async fetchBatch({commit}, { batchId }) {
      const batch = await this.$batches.getBatchById(batchId);
      commit(SET_BATCH, batch);
      return batch;
    },
    async fetchProducts({commit}) {
      const products = await this.$products.listProducts();
      commit(SET_PRODUCTS, products);
    },
    async fetchLocations({commit}) {
      const locations = await this.$locations.listLocations();
      commit(SET_LOCATIONS, locations);
    },
    async createUnit({ state, dispatch }, { unit }) {
    
      await this.$units.createUnit({
        ...unit,
        batch: state.batch
      });
      await dispatch('fetchBatch', { batchId: this.$_.get(state, 'batch.id', { })});
    },
    async updateUnit({ state, dispatch }, { unit }) {
      
      await this.$units.updateUnit({
        ...unit,
        batch: state.batch
      });
      await dispatch('fetchBatch', { batchId: this.$_.get(state, 'batch.id', { })});
    },
    async deleteUnit({ state, dispatch }, { unit }) {
      
      await this.$units.deleteUnit({
        ...unit,
        batch: state.batch
      });
      await dispatch('fetchBatch', { batchId: this.$_.get(state, 'batch.id', { })});
    },
    async fetchUnitStatuses({commit}) {
      const unitStatuses = await this.$unitStatuses.listUnitStatuses();
      commit(SET_UNIT_STATUSES, unitStatuses);
    },
  }