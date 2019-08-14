import { HeadGoverness } from 'vue-kindergarten';
export default class RouteGoverness extends HeadGoverness {
  guard(action, { redirect }) {
    return this.isAllowed(action) ? redirect() : redirect('/unauthorized');
  }
}