import SuppliersService from '@/api/suppliers.service';
import CountriesService from '@/api/countries.service';
import ProductsService from '@/api/products.service';

export default function(ctx, inject) {
  if (!ctx.$axios) {
    console.error( 'Please make sure $axios module is added');
  } else {
    inject('suppliers',  new SuppliersService(ctx));
    inject('countries', new CountriesService(ctx));
    inject('products', new ProductsService(ctx));
  }
}