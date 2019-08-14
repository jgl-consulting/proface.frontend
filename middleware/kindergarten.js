import { createSandbox } from 'vue-kindergarten';
import RouteGoverness from '@/security/governesses/route-governess';

import child from '@/security/child';

export default function (context) {
  const { route, error, redirect, store, isServer } = context;  
  
  route.matched.some((routeRecord) => {
    const options = routeRecord.components.default.options;
    const perimeters = options.perimeters;
    const Governess =  options.routeGoverness || RouteGoverness;
    const action = options.routePerimeterAction || 'route';
    if (perimeters) {
      const sandbox = createSandbox(child(store), {
        governess: new Governess(context),
        perimeters,
      });

      return sandbox.guard(action, { redirect });
    }
  });
}