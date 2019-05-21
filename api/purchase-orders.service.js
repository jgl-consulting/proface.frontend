import { PURCHASE_ORDERS_ENDPOINT } from '@/util/endpoints';
import { PURCHASE_STATUSES_ENDPOINT } from '@/util/endpoints';
import { SUPPLIERS_ENDPOINT } from '@/util/endpoints';
export default class PurchaseOrdersService {
  constructor({ $axios }) {
    this.$axios = $axios;
  }
  async listPurchaseOrdersBySupplier(supplierId, page, size, sortBy, direction) {
    const url = `${PURCHASE_ORDERS_ENDPOINT}/supplier/${supplierId}`;
    
    const purchaseOrders = await this.$axios.$get(url,{
      params: { 
        page, 
        size, 
        sort: sortBy ? `${sortBy},${direction}`: sortBy
      }
    });
    
    return { 
      purchaseOrders: purchaseOrders.content,
      page:  { 
        totalElements: purchaseOrders.totalElements,
        totalPages: purchaseOrders.totalPages,
        page: purchaseOrders.page,
        size: purchaseOrders.size,
        isSorted: purchaseOrders.isSorted
      }
    }
  }

  async listPurchaseOrders(page, size, sortBy, direction) {
    const purchaseOrders = await this.$axios.$get(PURCHASE_ORDERS_ENDPOINT, {
      params: { page, size, sort: sortBy ? `${sortBy},${direction}`: sortBy}
    });
    
    return { 
      purchaseOrders: purchaseOrders.content,
      page:  { 
        totalElements: purchaseOrders.totalElements,
        totalPages: purchaseOrders.totalPages,
        page: purchaseOrders.page,
        size: purchaseOrders.size,
        isSorted: purchaseOrders.isSorted
      }
    }
  }

  async listPurchaseOrdersBySupplier(page, size, sortBy, direction, supplierId) {
    const purchaseOrders = await this.$axios.$get(`${PURCHASE_ORDERS_ENDPOINT}/supplier/${supplierId}`, {
      params: { page, size, sort: sortBy ? `${sortBy},${direction}`: sortBy}
    });
    
    const extract = (purchaseOrder) => ({
      ...purchaseOrder
    });

    return { 
      purchaseOrders: purchaseOrders.content.map(extract),
      page:  { 
        totalElements: purchaseOrders.totalElements,
        totalPages: purchaseOrders.totalPages,
        page: purchaseOrders.page,
        size: purchaseOrders.size,
        isSorted: purchaseOrders.isSorted
      }
    }
  }

  listPurchaseStatuses() {
    return this.$axios.$get(`${PURCHASE_STATUSES_ENDPOINT}/unpaged`);
  }

  listSuppliers() {
    return this.$axios.$get(`${SUPPLIERS_ENDPOINT}/unpaged`)
  }

  getPurchaseOrderById(purchaseOrderId) {
    return this.$axios.$get(`${PURCHASE_ORDERS_ENDPOINT}/${purchaseOrderId}`);
  } 

  async createPurchaseOrder(purchaseOrder) {
    await this.$axios.$post(PURCHASE_ORDERS_ENDPOINT, purchaseOrder);
  }

  async updatePurchaseOrder(purchaseOrder) {
    const { id } = purchaseOrder;
    await this.$axios.$put(`${PURCHASE_ORDERS_ENDPOINT}/${id}`, purchaseOrder);
  }

  async deletePurchaseOrder({ id }) {
    await this.$axios.$delete(`${PURCHASE_ORDERS_ENDPOINT}/${id}`);
  }

}