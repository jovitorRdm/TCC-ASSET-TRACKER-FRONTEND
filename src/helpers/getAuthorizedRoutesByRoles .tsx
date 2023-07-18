import { AccountType } from '../types/accountType';

const prefix = '/panel';

const baseRoutes = [
  prefix,
  `${prefix}/assignment`,
  `${prefix}/event-type`,
  `${prefix}/employee`,
  `${prefix}/customer`,
  `${prefix}/serviceItem`,
  `${prefix}/product`,
];
const authorizedRoutesByAccount: { [key in AccountType]: string[] } = {
  [AccountType.EVENTADMINISTRATOR]: baseRoutes,
  [AccountType.RECEPTIONIST]: baseRoutes,
};

export function getAuthorizedRoutesByRoles(accountType: AccountType[]) {
  const authorizedRoutes = accountType.map(
    (role) => authorizedRoutesByAccount[role]
  )[0];

  const uniqueRoutes = authorizedRoutes.filter((route, index, array) => {
    return array.indexOf(route) === index;
  });

  return uniqueRoutes;
}
