import { find } from 'lodash';
import { matchPath } from 'react-router-dom';
import pathToRegexp from 'path-to-regexp';
import routesConfiguration from '../routesConfiguration';

export const flattenRoutes = routesArray =>
  routesArray.reduce((a, b) => a.concat(b.routes ? [b].concat(flattenRoutes(b.routes)) : b), []);

export const findRouteByName = (nameToFind, routes) => {
  const flattenedRoutes = flattenRoutes(routes);
  return find(flattenedRoutes, route => route.name === nameToFind);
};

/**
 * E.g. ```const toListingPath = toPathByRouteName('ListingPage', routes);```
 * Then we can generate listing paths with given params (```toListingPath({ id: uuidX })```)
 */
export const toPathByRouteName = (nameToFind, routes) => {
  const route = findRouteByName(nameToFind, routes);
  if (!route) {
    throw new Error(`Path "${nameToFind}" was not found.`);
  }
  return pathToRegexp.compile(route.path);
};

/**
 * Shorthand for single path call. (```pathByRouteName('ListingPage', routes, { id: uuidX });```)
 */
export const pathByRouteName = (nameToFind, routes, params = {}) =>
  toPathByRouteName(nameToFind, routes)(params);

/**
 * matchRoutesToLocation helps to figure out which routes are related to given location.
 */
const matchRoutesToLocation = (routes, location, matchedRoutes = [], params = {}) => {
  let parameters = { ...params };
  let matched = [...matchedRoutes];

  routes.forEach(route => {
    const { exact = false } = route;
    const match = !route.path || matchPath(location.pathname, route.path, { exact });

    if (match) {
      matched.push(route);

      if (match.params) {
        parameters = { ...parameters, ...match.params };
      }
    }

    if (route.routes) {
      const { matchedRoutes: subRouteMatches, params: subRouteParams } = matchRoutesToLocation(
        route.routes,
        location,
        matched,
        parameters,
      );
      matched = matched.concat(subRouteMatches);
      parameters = { ...parameters, ...subRouteParams };
    }
  });

  return { matchedRoutes: matched, params: parameters };
};

const matchPathnameCreator = routes =>
  (location, matchedRoutes = [], params = {}) =>
    matchRoutesToLocation(routes, { pathname: location }, matchedRoutes, params);

/**
 * matchRoutesToLocation helps to figure out which routes are related to given location.
 */
export const matchPathname = matchPathnameCreator(routesConfiguration);
