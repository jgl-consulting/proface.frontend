export default [
  {
    title: 'Proveedores',
    icon: 'fa fa-truck',
    to: '/proveedores',
    description: 'Todo acerca de los proveedores de la compañia',
    allowedRoles: ['COMPRAS'],
  },
  {
    title: 'Productos',
    icon: 'fa fa-boxes',
    to: '/productos',
    allowedRoles: ['COMPRAS'],
  }
]