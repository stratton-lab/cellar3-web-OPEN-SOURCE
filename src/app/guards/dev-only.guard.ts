import {CanActivateFn} from '@angular/router';
import {environment} from "../../environments/environment";

export const devOnlyGuard: CanActivateFn = (route, state) => {
  return !environment.production || window?.location?.href?.includes('dev-open')
}
