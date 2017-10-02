import React from 'react';
import {
  createBooking,
  createCurrentUser,
  createListing,
  createTransaction,
  createUser,
  fakeIntl,
} from '../../util/test-data';
import { renderShallow } from '../../util/test-helpers';
import { TX_TRANSITION_PREAUTHORIZE } from '../../util/propTypes';
import { OrderPageComponent } from './OrderPage';

const noop = () => null;

describe('OrderPage', () => {
  it('matches snapshot', () => {
    const txId = 'tx-order-1';
    const transaction = createTransaction({
      id: txId,
      lastTransition: TX_TRANSITION_PREAUTHORIZE,
      booking: createBooking('booking1', {
        start: new Date(Date.UTC(2017, 5, 10)),
        end: new Date(Date.UTC(2017, 5, 13)),
      }),
      listing: createListing('listing1'),
      customer: createUser('customer1'),
      provider: createUser('provider1'),
    });

    const props = {
      authInProgress: false,
      currentUserHasListings: false,
      isAuthenticated: false,
      onLogout: noop,
      onManageDisableScrolling: noop,
      currentUser: createCurrentUser('customer1'),
      params: { id: txId },
      transaction,
      tab: 'details',
      intl: fakeIntl,
      scrollingDisabled: false,
      location: { search: '' },
      history: {
        push: () => console.log('HistoryPush called'),
      },
      sendVerificationEmailInProgress: false,
      onResendVerificationEmail: noop,
    };

    const tree = renderShallow(<OrderPageComponent {...props} />);
    expect(tree).toMatchSnapshot();
  });
});
