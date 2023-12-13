import { AccountType } from '../types/accountType';

const baseRoutes = [
  `/assignment`,
  `/event-type`,
  `/employee`,
  `/customer`,
  `/serviceItem`,
  `/product`,
  `/supplier`,
  `/fiscalProduct`,
  `/budget`,
  `/eventSalons`,
];
const authorizedRoutesByAccount: { [key in AccountType]: string[] } = {
  [AccountType.EVENTADMINISTRATOR]: baseRoutes,
  [AccountType.RECEPTIONIST]: baseRoutes,
};

export function getAuthorizedRoutesByRoles(accountType: AccountType) {
  const authorizedRoutes = authorizedRoutesByAccount[accountType];

  const uniqueRoutes = authorizedRoutes.filter((route, index, array) => {
    return array.indexOf(route) === index;
  });

  return uniqueRoutes;
}
