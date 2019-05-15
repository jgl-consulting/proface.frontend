import _ from 'lodash';
import menus from '@/util/menus';

export default function ({ store, params, route}) {
  const { name, meta } = route;
  store.dispatch('loadPageInfo', {
    title: getTitle(name),
    breadcrumbs:  getBreadcrumbs({ meta, params, route })
  });
}

function getTitle(name) {
  const [ id ] = name.split("-");
  const { title } =  _.find(menus, menu => menu.id === id)
  return title;
}

function getBreadcrumbs({ meta, params, route }) {
  const { breadcrumbs } = meta.reduce(
    (metadata, item) => ({ ...metadata, ...item})
  , {});
  
  return breadcrumbs.map(
    bc => bc instanceof Function ? bc(params, route) : bc
  );
}