import {
    SALE_ORDERS_ENDPOINT
  } from '@/util/endpoints';
  export default class SaleOrdersService {
    constructor({
      $axios
    }) {
      this.$axios = $axios;
    }
  
    async pageSaleOrders(page, size, sortBy, direction, filter, unpaged) {
      const saleOrders = await this.$axios.$get(SALE_ORDERS_ENDPOINT, {
        params: {
          page,
          size,
          sort: sortBy ? `${sortBy},${direction}` : sortBy,
          filter
        }
      });
  
      return {
        saleOrders: saleOrders.content,
        page: {
          totalElements: saleOrders.totalElements,
          totalPages: saleOrders.totalPages,
          page: saleOrders.page,
          size: saleOrders.size,
          isSorted: saleOrders.isSorted
        }
      }
    }
  
    async listSaleOrders() {
      return await this.$axios.$get(SALE_ORDERS_ENDPOINT, {
        params: {
          unpaged: true
        }
      });
    }
  
    getSaleOrderById(saleOrderId) {
      return this.$axios.$get(`${SALE_ORDERS_ENDPOINT}/${saleOrderId}`);
    }
  
    async createSaleOrder(saleOrder) {
      await this.$axios.$post(SALE_ORDERS_ENDPOINT, saleOrder);
    }
  
    async updateSaleOrder(saleOrder) {
      const {
        id
      } = saleOrder;
      await this.$axios.$put(`${SALE_ORDERS_ENDPOINT}/${id}`, saleOrder);
    }
  
    async deleteSaleOrder({
      id
    }) {
      await this.$axios.$delete(`${SALE_ORDERS_ENDPOINT}/${id}`);
    }
  
  }
  