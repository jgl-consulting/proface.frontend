import _ from 'lodash';
import menus from '@/util/menus';

export default function ({ store, params, route }) {
  const { name, meta } = route;
  const breadcrumbs = getBreadcrumbs(meta,{ params, route, store });

  if(name && meta && breadcrumbs) {
    store.dispatch('loadPageInfo', {
      title: getTitle(name),
      breadcrumbs 
    });
  }
}

function getTitle(name) {
  const [ id ] = name.split("-");
  const menu = _.find(menus, menu => menu.id === id);
  const { title } =  menu || { title: 'Inicio' };
  return title;
}

function metaToObject(meta) {
  return meta.reduce(
    (metadata, item) => ({ ...metadata, ...item})
  , {});
}

function getBreadcrumbs(meta, context) {
  const breadcrumbs = _.get(metaToObject(meta), 'breadcrumbs', false);
  let renderBreadcrumbs = bc => isFunction(bc) ? bc(context) : bc;
  return breadcrumbs ? breadcrumbs.map(renderBreadcrumbs):[];
}

function isFunction(ref) {
  return ref instanceof Function;
}