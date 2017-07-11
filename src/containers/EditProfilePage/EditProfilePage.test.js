import React from 'react';
import { renderShallow } from '../../util/test-helpers';
import { EditProfilePageComponent } from './EditProfilePage';

const noop = () => null;

describe('ContactDetailsPage', () => {
  it('matches snapshot', () => {
    const tree = renderShallow(
      <EditProfilePageComponent
        params={{ displayName: 'my-shop' }}
        history={{ push: noop }}
        location={{ search: '' }}
        scrollingDisabled={false}
        authInProgress={false}
        currentUserHasListings={false}
        isAuthenticated={false}
        onLogout={noop}
        onManageDisableScrolling={noop}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
