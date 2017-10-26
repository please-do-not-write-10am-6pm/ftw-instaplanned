import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import { types } from '../../util/sdkLoader';
import { createUser, createCurrentUser, createListing, fakeIntl } from '../../util/test-data';
import { storableError } from '../../util/errors';
import { renderShallow } from '../../util/test-helpers';
import { addMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { showListingRequest, showListingError, showListing } from './ListingPage.duck';

// routeConfiguration needs to be imported before tests for ListingPageComponent can be made.
// Otherwise, ListingPage itself is not initialized correctly when routeConfiguration is imported
// (loadData call fails).
import routeConfiguration from '../../routeConfiguration';
import { ListingPageComponent, ActionBar } from './ListingPage';

const { UUID } = types;
const noop = () => null;

describe('ListingPage', () => {
  it('matches snapshot', () => {
    const currentUser = createCurrentUser('user-2');
    const id = 'listing1';
    const slug = 'listing1-title';
    const listing1 = createListing(id, {}, { author: createUser('user-1') });
    const getListing = () => listing1;

    const props = {
      location: {
        pathname: `/l/${slug}/${id}`,
        search: '',
        hash: '',
      },
      history: {
        push: () => console.log('HistoryPush called'),
      },
      params: { id, slug },
      currentUser,
      getListing: getListing,
      intl: fakeIntl,
      authInProgress: false,
      currentUserHasListings: false,
      isAuthenticated: false,
      onLogout: noop,
      onLoadListing: noop,
      onManageDisableScrolling: noop,
      scrollingDisabled: false,
      useInitialValues: noop,
      sendVerificationEmailInProgress: false,
      onResendVerificationEmail: noop,
    };

    const tree = renderShallow(<ListingPageComponent {...props} />);
    expect(tree).toMatchSnapshot();
  });

  describe('Duck', () => {
    it('showListing() success', () => {
      const id = new UUID('00000000-0000-0000-0000-000000000000');
      const dispatch = jest.fn(action => action);
      const response = { status: 200 };
      const show = jest.fn(() => Promise.resolve(response));
      const sdk = { listings: { show }, currentUser: { show } };

      return showListing(id)(dispatch, null, sdk).then(data => {
        expect(data).toEqual(response);
        expect(show.mock.calls).toEqual([
          [{ id, include: ['author', 'author.profileImage', 'images'] }],
        ]);
        expect(dispatch.mock.calls).toEqual([
          [showListingRequest(id)],
          [expect.anything()], // fetchCurrentUser() call
          [addMarketplaceEntities(data)],
        ]);
      });
    });

    it('showListing() error', () => {
      const id = new UUID('00000000-0000-0000-0000-000000000000');
      const dispatch = jest.fn(action => action);
      const error = new Error('fail');
      const show = jest.fn(() => Promise.reject(error));
      const sdk = { listings: { show } };

      // Calling sdk.listings.show is expected to fail now

      return showListing(id)(dispatch, null, sdk).then(data => {
        expect(show.mock.calls).toEqual([
          [{ id, include: ['author', 'author.profileImage', 'images'] }],
        ]);
        expect(dispatch.mock.calls).toEqual([
          [showListingRequest(id)],
          [expect.anything()], // fetchCurrentUser() call
          [showListingError(storableError(error))],
        ]);
      });
    });
  });

  describe('ActionBar', () => {
    it('shows users own listing status', () => {
      const actionBar = shallow(<ActionBar isOwnListing isClosed={false} editParams={{}} />);
      const formattedMessages = actionBar.find(FormattedMessage);
      expect(formattedMessages.length).toEqual(2);
      expect(formattedMessages.at(0).props().id).toEqual('ListingPage.ownListing');
      expect(formattedMessages.at(1).props().id).toEqual('ListingPage.editListing');
    });
    it('shows users own closed listing status', () => {
      const actionBar = shallow(<ActionBar isOwnListing isClosed editParams={{}} />);
      const formattedMessages = actionBar.find(FormattedMessage);
      expect(formattedMessages.length).toEqual(2);
      expect(formattedMessages.at(0).props().id).toEqual('ListingPage.ownClosedListing');
      expect(formattedMessages.at(1).props().id).toEqual('ListingPage.editListing');
    });
    it('shows closed listing status', () => {
      const actionBar = shallow(<ActionBar isOwnListing={false} isClosed editParams={{}} />);
      const formattedMessages = actionBar.find(FormattedMessage);
      expect(formattedMessages.length).toEqual(1);
      expect(formattedMessages.at(0).props().id).toEqual('ListingPage.closedListing');
    });
    it("is missing if listing is not closed or user's own", () => {
      const actionBar = shallow(
        <ActionBar isOwnListing={false} isClosed={false} editParams={{}} />
      );
      expect(actionBar.equals(null)).toEqual(true);
    });
  });
});
