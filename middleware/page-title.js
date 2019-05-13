import _ from 'lodash';
import breadcrumbs from '@/util/breadcrumbs';

export default function ({ store, route }) {
  const { name } = route;
  if(name) {
    let [ pageTitle ] = name.split("-");  
  
    store.dispatch('loadPageInfo', {
      title: pageTitle != 'index' ? _.capitalize(pageTitle) : 'Inicio',
      constructor: breadcrumbs[name],
      params: []
    });
  }
}