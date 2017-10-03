import React, { PropTypes } from 'react';
import { injectIntl, intlShape, FormattedDate, FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import * as propTypes from '../../util/propTypes';
import { createSlug } from '../../util/urlHelpers';
import { ensureListing, ensureTransaction, ensureUser, userDisplayName } from '../../util/data';
import {
  AvatarLarge,
  AvatarMedium,
  BookingBreakdown,
  NamedLink,
  ResponsiveImage,
  PrimaryButton,
  SecondaryButton,
} from '../../components';

import css from './SaleDetailsPanel.css';

const breakdown = transaction => {
  const loaded = transaction && transaction.id && transaction.booking && transaction.booking.id;

  return loaded
    ? <BookingBreakdown
        userRole="provider"
        transaction={transaction}
        booking={transaction.booking}
      />
    : null;
};

const saleTitle = (transaction, listingLink, customerName) => {
  if (propTypes.txIsPreauthorized(transaction)) {
    return (
      <FormattedMessage
        id="SaleDetailsPanel.listingRequestedTitle"
        values={{ customerName, listingLink }}
      />
    );
  } else if (propTypes.txIsAccepted(transaction)) {
    return (
      <FormattedMessage
        id="SaleDetailsPanel.listingAcceptedTitle"
        values={{ customerName, listingLink }}
      />
    );
  } else if (propTypes.txIsRejected(transaction)) {
    return (
      <FormattedMessage
        id="SaleDetailsPanel.listingRejectedTitle"
        values={{ customerName, listingLink }}
      />
    );
  } else if (propTypes.txIsAutorejected(transaction)) {
    return (
      <FormattedMessage
        id="SaleDetailsPanel.listingRejectedTitle"
        values={{ customerName, listingLink }}
      />
    );
  } else if (propTypes.txIsDelivered(transaction)) {
    return (
      <FormattedMessage
        id="SaleDetailsPanel.listingDeliveredTitle"
        values={{ customerName, listingLink }}
      />
    );
  } else {
    return null;
  }
};

const saleMessage = (transaction, customerName) => {
  const formattedDate = (
    <span className={css.nowrap}>
      <FormattedDate
        value={transaction.attributes.lastTransitionedAt}
        year="numeric"
        month="short"
        day="numeric"
        weekday="long"
      />
    </span>
  );
  if (propTypes.txIsPreauthorized(transaction)) {
    return <FormattedMessage id="SaleDetailsPanel.saleRequestedStatus" values={{ customerName }} />;
  } else if (propTypes.txIsAccepted(transaction)) {
    return <FormattedMessage id="SaleDetailsPanel.saleAcceptedStatus" values={{ formattedDate }} />;
  } else if (propTypes.txIsRejected(transaction)) {
    return <FormattedMessage id="SaleDetailsPanel.saleRejectedStatus" values={{ formattedDate }} />;
  } else if (propTypes.txIsAutorejected(transaction)) {
    return (
      <FormattedMessage id="SaleDetailsPanel.saleAutoRejectedStatus" values={{ formattedDate }} />
    );
  } else if (propTypes.txIsDelivered(transaction)) {
    return (
      <FormattedMessage id="SaleDetailsPanel.saleDeliveredStatus" values={{ formattedDate }} />
    );
  } else {
    return null;
  }
};

export const SaleDetailsPanelComponent = props => {
  const {
    rootClassName,
    className,
    transaction,
    onAcceptSale,
    onRejectSale,
    acceptInProgress,
    rejectInProgress,
    acceptSaleError,
    rejectSaleError,
    intl,
  } = props;
  const currentTransaction = ensureTransaction(transaction);
  const currentListing = ensureListing(currentTransaction.listing);
  const currentCustomer = ensureUser(currentTransaction.customer);
  const customerLoaded = !!currentCustomer.id;
  const isCustomerBanned = customerLoaded && currentCustomer.attributes.banned;

  const bannedUserDisplayName = intl.formatMessage({
    id: 'SaleDetailsPanel.bannedUserDisplayName',
  });

  const customerDisplayName = userDisplayName(currentCustomer, bannedUserDisplayName);

  let listingLink = null;

  if (currentListing.id && currentListing.attributes.title) {
    const title = currentListing.attributes.title;
    const params = { id: currentListing.id.uuid, slug: createSlug(title) };
    listingLink = (
      <NamedLink name="ListingPage" params={params}>
        {title}
      </NamedLink>
    );
  }

  const bookingInfo = breakdown(currentTransaction);

  const title = saleTitle(currentTransaction, listingLink, customerDisplayName);
  const message = isCustomerBanned
    ? intl.formatMessage({
        id: 'SaleDetailsPanel.customerBannedStatus',
      })
    : saleMessage(currentTransaction, customerDisplayName);

  const listingTitle = currentListing.attributes.title;
  const firstImage = currentListing.images && currentListing.images.length > 0
    ? currentListing.images[0]
    : null;

  const canShowButtons = propTypes.txIsPreauthorized(currentTransaction) && !isCustomerBanned;
  const buttonsDisabled = acceptInProgress || rejectInProgress;

  const acceptErrorMessage = acceptSaleError
    ? <p className={css.error}>
        <FormattedMessage id="SaleDetailsPanel.acceptSaleFailed" />
      </p>
    : null;
  const rejectErrorMessage = rejectSaleError
    ? <p className={css.error}>
        <FormattedMessage id="SaleDetailsPanel.rejectSaleFailed" />
      </p>
    : null;

  const actionButtons = canShowButtons
    ? <div className={css.actionButtons}>
        <div className={css.errorDesktop}>
          {acceptErrorMessage}
          {rejectErrorMessage}
        </div>
        <SecondaryButton
          className={css.rejectButton}
          inProgress={rejectInProgress}
          disabled={buttonsDisabled}
          onClick={() => onRejectSale(currentTransaction.id)}
        >
          <FormattedMessage id="SalePage.rejectButton" />
        </SecondaryButton>
        <PrimaryButton
          className={css.acceptButton}
          inProgress={acceptInProgress}
          disabled={buttonsDisabled}
          onClick={() => onAcceptSale(currentTransaction.id)}
        >
          <FormattedMessage id="SalePage.acceptButton" />
        </PrimaryButton>
      </div>
    : null;

  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={classes}>
      <div className={css.container}>
        <div className={css.imageWrapperMobile}>
          <div className={css.aspectWrapper}>
            <ResponsiveImage
              rootClassName={css.rootForImage}
              alt={listingTitle}
              image={firstImage}
              nameSet={[
                { name: 'landscape-crop', size: '400w' },
                { name: 'landscape-crop2x', size: '800w' },
              ]}
              sizes="100vw"
            />
          </div>
        </div>
        <div className={css.avatarWrapper}>
          <AvatarMedium user={currentCustomer} className={css.avatarMobile} />
        </div>
        <div className={css.info}>
          <div className={css.avatarWrapper}>
            <AvatarLarge user={currentCustomer} className={css.avatarDesktop} />
          </div>
          <h1 className={css.title}>{title}</h1>
          <p className={css.message}>{message}</p>
          <div className={css.errorMobile}>
            {acceptErrorMessage}
            {rejectErrorMessage}
          </div>
          {actionButtons}
        </div>
        <div className={css.breakdownContainerMobile}>
          <h3 className={css.breakdownTitleMobile}>
            <FormattedMessage id="SaleDetailsPanel.bookingBreakdownTitle" />
          </h3>
          {bookingInfo}
        </div>
        <div className={css.breakdownContainerDesktop}>
          <div className={css.breakdownImageWrapper}>
            <div className={css.aspectWrapper}>
              <ResponsiveImage
                rootClassName={css.rootForImage}
                alt={listingTitle}
                image={firstImage}
                nameSet={[
                  { name: 'landscape-crop', size: '400w' },
                  { name: 'landscape-crop2x', size: '800w' },
                ]}
                sizes="100%"
              />
            </div>
          </div>
          <h3 className={css.breakdownTitleDesktop}>
            <FormattedMessage id="SaleDetailsPanel.bookingBreakdownTitle" />
          </h3>
          <div className={css.breakdownDesktop}>
            {bookingInfo}
          </div>
        </div>
      </div>
    </div>
  );
};

SaleDetailsPanelComponent.defaultProps = {
  rootClassName: null,
  className: null,
  acceptSaleError: null,
  rejectSaleError: null,
};

const { string, func, bool, instanceOf } = PropTypes;

SaleDetailsPanelComponent.propTypes = {
  rootClassName: string,
  className: string,
  transaction: propTypes.transaction.isRequired,
  onAcceptSale: func.isRequired,
  onRejectSale: func.isRequired,
  acceptInProgress: bool.isRequired,
  rejectInProgress: bool.isRequired,
  acceptSaleError: instanceOf(Error),
  rejectSaleError: instanceOf(Error),

  // from injectIntl
  intl: intlShape.isRequired,
};

const SaleDetailsPanel = injectIntl(SaleDetailsPanelComponent);

export default SaleDetailsPanel;
