import _ from 'lodash';

export default function ({ store, route }) {
  const { name } = route;
  
  let [ pageTitle ] = name.split("-");  

  store.dispatch('loadCurrentTitle', pageTitle != 'index' ? _.capitalize(pageTitle) : 'Inicio');
}