export default [{
    id: 'compras',
    title: 'Compras',
    icon: 'fa fa-shopping-bag',
    description: 'Módulo de Gestión de Compras',
    perimeterAction: 'viewPurchase',
    children: [{
        id: 'bancos',
        title: 'Bancos',
        icon: 'fa fa-piggy-bank',
        to: '/compras/bancos',
        description: 'Gestión de bancos de la compañía',
        perimeterAction: 'viewPurchase'
      },
      {
        id: 'estadosCompra',
        title: 'Estados de Compra',
        icon: 'fa fa-project-diagram',
        to: '/compras/estadosCompra',
        description: 'Gestión de estados de compra de la compañía',
        perimeterAction: 'viewPurchase'
      },
      {
        id: 'estadosRecepcion',
        title: 'Estados de Recepción',
        icon: 'fa fa-question-circle',
        to: '/compras/estadosRecepcion',
        description: 'Gestión de estados de recepción de la compañía',
        perimeterAction: 'viewPurchase'
      },
      {
        id: 'lineasProducto',
        title: 'Líneas de Producto',
        icon: 'fa fa-tags',
        to: '/compras/lineasProducto',
        description: 'Gestión de líneas de producto de la compañía',
        perimeterAction: 'viewPurchase'
      },
      {
        id: 'ordenesCompra',
        title: 'Órdenes de Compra',
        icon: 'fa fa-shopping-cart',
        to: '/compras/ordenesCompra',
        description: 'Gestión de órdenes de compra de la compañía',
        perimeterAction: 'viewPurchase'
      },
      {
        id: 'productos',
        title: 'Productos',
        icon: 'fa fa-boxes',
        to: '/compras/productos',
        description: 'Gestión de productos de la compañía',
        perimeterAction: 'viewPurchase',
      },
      {
        id: 'proveedores',
        title: 'Proveedores',
        icon: 'fa fa-truck',
        to: '/compras/proveedores',
        description: 'Gestión de proveedores de la compañía',
        perimeterAction: 'viewPurchase',
      },
    ]
  },
  {
    id: 'almacen',
    title: 'Almacén',
    icon: 'fa fa-store',
    description: 'Módulo de Gestión de Almacén',
    perimeterAction: 'viewWarehouse',
    children: [{
        id: 'ubicaciones',
        title: 'Ubicaciones',
        icon: 'fa fa-map-marker-alt',
        to: '/almacen/ubicaciones',
        description: 'Gestión de ubicaciones de la compañía',
        perimeterAction: 'viewWarehouse'
      },
      {
        id: 'tiposEmpaque',
        title: 'Tipos de Empaque',
        icon: 'fa fa-paperclip',
        to: '/almacen/tiposEmpaque',
        description: 'Gestión de tipos de empaque de la compañía',
        perimeterAction: 'viewWarehouse'
      },
      {
        id: 'estadosUnidad',
        title: 'Estados de Unidad',
        icon: 'fa fa-play-circle',
        to: '/almacen/estadosUnidad',
        description: 'Gestión de estados de unidad de la compañía',
        perimeterAction: 'viewWarehouse'
      },
      {
        id: 'empaques',
        title: 'Empaques',
        icon: 'fa fa-archive',
        to: '/almacen/empaques',
        description: 'Gestión de empaques de la compañía',
        perimeterAction: 'viewWarehouse'
      },
      {
        id: 'unidades',
        title: 'Unidades',
        icon: 'fa fa-parking',
        to: '/almacen/unidades',
        description: 'Gestión de unidades de la compañía',
        perimeterAction: 'viewWarehouse'
      },
    ]
  },
  {
    id: 'ventas',
    title: 'Ventas',
    icon: 'fa fa-shopping-basket',
    description: 'Módulo de Gestión de Ventas',
    perimeterAction: 'viewSale',
    children: [{
        id: 'tiposCliente',
        title: 'Tipos de Cliente',
        icon: 'fa fa-user-tag',
        to: '/ventas/tiposCliente',
        description: 'Gestión de tipos de clientes de la compañía',
        perimeterAction: 'viewSale'
      },
      {
        id: 'clientes',
        title: 'Clientes',
        icon: 'fa fa-users',
        to: '/ventas/clientes',
        description: 'Gestión de clientes de la compañía',
        perimeterAction: 'viewSale'
      },
      {
        id: 'estadosVenta',
        title: 'Estados de Venta',
        icon: 'fa fa-star',
        to: '/ventas/estadosVenta',
        description: 'Gestión de estados de venta de la compañía',
        perimeterAction: 'viewSale'
      },
      {
        id: 'ordenesVenta',
        title: 'Órdenes de Venta',
        icon: 'fa fa-cash-register',
        to: '/ventas/ordenesVenta',
        description: 'Gestión de órdenes de venta de la compañía',
        perimeterAction: 'viewSale'
      }      
    ]
  }
]
