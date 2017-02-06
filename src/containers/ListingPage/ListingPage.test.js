import React from 'react';
import { renderTree } from '../../util/test-helpers';
import { RoutesProvider } from '../../components';
import routesConfiguration from '../../routesConfiguration';
import ListingPage from './ListingPage';

describe('ListingPage', () => {
  it('matches snapshot', () => {
    const tree = renderTree(
      <RoutesProvider routes={routesConfiguration}>
        <ListingPage params={{ slug: 'banyan-studios', id: 1234 }} />
      </RoutesProvider>,
    );
    expect(tree).toMatchSnapshot();
  });
});
