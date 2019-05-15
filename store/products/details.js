import { 
    SET_PRODUCT
  } from '@/util/mutations-types'
  export const state = () => ({
    product: {}
  });
  
  export const mutations = {
    [SET_PRODUCT](state, product){
      state.product = product;
    }
  }
  
  export const actions = {
    async fetchProduct({commit}, { productId }) {
      const product = await this.$products.getProductById(productId);
      commit(SET_PRODUCT, product);
      return product;
    }
  }