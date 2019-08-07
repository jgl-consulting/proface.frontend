import SuppliersService from '@/api/suppliers.service';
import SupplierTypesService from '@/api/supplier-types.service';
import CountriesService from '@/api/countries.service';
import ProductsService from '@/api/products.service';
import ProductLinesService from '@/api/product-lines.service';
import PurchaseOrdersService from '@/api/purchase-orders.service';
import PurchaseStatusesService from '@/api/purchase-statuses.service';
import BanksService from '@/api/banks.service';
import SupplierAccountsService from '@/api/supplier-accounts.service';
import ReceptionStatusesService from '@/api/reception-statuses.service';
import PurchaseDetailsService from '@/api/purchase-details.service';
import PurchaseCostsService from '@/api/purchase-costs.service';
import PurchaseInvoicesService from '@/api/purchase-invoices.service';
import CurrenciesService from '@/api/currencies.service';
import LocationsService from '@/api/locations.service';
import BatchTypesService from '@/api/batch-types.service';
import UnitStatusesService from '@/api/unit-statuses.service';
import BatchesService from '@/api/batches.service';
import UnitsService from '@/api/units.service';
import ClientTypesService from '@/api/client-types.service';
import ClientsService from '@/api/clients.service'; 
import SaleOrdersService from '@/api/sale-orders.service';
import SaleStatusesService from '@/api/sale-statuses.service';
import SaleDetailsService from '@/api/sale-details.service';
import SaleInvoicesService from '@/api/sale-invoices.service';

export default function (ctx, inject) {
  if (!ctx.$axios) {
    console.error('Please make sure $axios module is added');
  } else {
    inject('suppliers', new SuppliersService(ctx));
    inject('supplierTypes', new SupplierTypesService(ctx));
    inject('countries', new CountriesService(ctx));
    inject('products', new ProductsService(ctx));
    inject('productLines', new ProductLinesService(ctx));
    inject('purchaseOrders', new PurchaseOrdersService(ctx));
    inject('purchaseStatuses', new PurchaseStatusesService(ctx));
    inject('banks', new BanksService(ctx));
    inject('supplierAccounts', new SupplierAccountsService(ctx));
    inject('receptionStatuses', new ReceptionStatusesService(ctx));
    inject('purchaseDetails', new PurchaseDetailsService(ctx));
    inject('purchaseCosts', new PurchaseCostsService(ctx));
    inject('purchaseInvoices', new PurchaseInvoicesService(ctx));
    inject('currencies', new CurrenciesService(ctx));
    inject('locations', new LocationsService(ctx));
    inject('batchTypes', new BatchTypesService(ctx));
    inject('unitStatuses', new UnitStatusesService(ctx));
    inject('batches', new BatchesService(ctx));
    inject('units', new UnitsService(ctx));
    inject('clientTypes', new ClientTypesService(ctx));
    inject('clients', new ClientsService(ctx));
    inject('saleOrders', new SaleOrdersService(ctx));
    inject('saleStatuses', new SaleStatusesService(ctx));
    inject('saleDetails', new SaleDetailsService(ctx));
    inject('saleInvoices', new SaleInvoicesService(ctx));
  }
}
