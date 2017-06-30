/**
 * This component will show the booking info and calculated total price.
 * I.e. dates and other details related to payment decision in receipt format.
 */
import _ from 'lodash';
import React, { PropTypes } from 'react';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import Decimal from 'decimal.js';
import classNames from 'classnames';
import config from '../../config';
import { convertMoneyToNumber } from '../../util/currency';
import * as propTypes from '../../util/propTypes';

import css from './BookingBreakdown.css';

export const BookingBreakdownComponent = props => {
  const {
    rootClassName,
    className,
    bookingStart,
    bookingEnd,
    payinTotal,
    payoutTotal,
    lineItems,
    userRole,
    intl,
  } = props;

  const classes = classNames(rootClassName || css.root, className);

  const dateFormatOptions = {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
  };
  const bookingPeriod = (
    <FormattedMessage
      id="BookingBreakdown.bookingPeriod"
      values={{
        bookingStart: (
          <span className={css.nowrap}>
            {intl.formatDate(bookingStart, dateFormatOptions)}
          </span>
        ),
        bookingEnd: (
          <span className={css.nowrap}>
            {intl.formatDate(bookingEnd, dateFormatOptions)}
          </span>
        ),
      }}
    />
  );

  const nightPurchase = _.find(lineItems, item => item.code === 'line-item.purchase/night');
  const providerCommission = _.find(
    lineItems,
    item => item.code === 'line-item.commission/provider'
  );

  const nightCount = nightPurchase.quantity.toFixed();
  const nightCountMessage = (
    <FormattedMessage id="BookingBreakdown.nightCount" values={{ count: nightCount }} />
  );

  const currencyConfig = config.currencyConfig;
  const subUnitDivisor = currencyConfig.subUnitDivisor;

  const unitPriceAsNumber = convertMoneyToNumber(nightPurchase.unitPrice, subUnitDivisor);
  const formattedUnitPrice = intl.formatNumber(unitPriceAsNumber, currencyConfig);

  // If commission is passed it will be shown as a fee already reduces from the total price
  let commissionInfo = null;

  if (userRole === "provider") {
    const commission = providerCommission.lineTotal;
    const commissionAsNumber = commission ? convertMoneyToNumber(commission, subUnitDivisor) : 0;
    const formattedCommission = commission
                              ? intl.formatNumber(new Decimal(commissionAsNumber).negated().toNumber(), currencyConfig)
                              : null;

    commissionInfo = (
      <div className={css.lineItem}>
      <span className={css.itemLabel}>
        <FormattedMessage id="BookingBreakdown.commission" />
      </span>
      <span className={css.itemValue}>{formattedCommission}</span>
    </div>
    );
  }

  const totalPriceAsNumber = convertMoneyToNumber(
    userRole === 'customer' ? payinTotal : payoutTotal,
    subUnitDivisor
  );
  const formattedTotalPrice = totalPriceAsNumber
    ? intl.formatNumber(totalPriceAsNumber, currencyConfig)
    : null;

  return (
    <div className={classes}>
      <div className={css.lineItem}>
        <span className={css.itemLabel}>
          <FormattedMessage id="BookingBreakdown.pricePerNight" />
        </span>
        <span className={css.itemValue}>{formattedUnitPrice}</span>
      </div>
      <div className={css.lineItem}>
        <span className={css.itemLabel}>
          {bookingPeriod}
        </span>
        <span className={css.itemValue}>{nightCountMessage}</span>
      </div>
      {commissionInfo}
      <hr className={css.totalDivider} />
      <div className={css.lineItem}>
        <div className={css.totalLabel}>
          <FormattedMessage id="BookingBreakdown.total" />
        </div>
        <div className={css.totalPrice}>
          {formattedTotalPrice}
        </div>
      </div>
    </div>
  );
};

BookingBreakdownComponent.defaultProps = {
  rootClassName: null,
  className: null,
  payinTotal: null,
  payoutTotal: null,
};

const { string, instanceOf, arrayOf, oneOf, shape } = PropTypes;

const lineItem = shape({
  code: string.isRequired,
  quantity: instanceOf(Decimal),
  unitPrice: propTypes.money,
  lineTotal: propTypes.money,
});

BookingBreakdownComponent.propTypes = {
  rootClassName: string,
  className: string,

  bookingStart: instanceOf(Date).isRequired,
  bookingEnd: instanceOf(Date).isRequired,
  lineItems: arrayOf(lineItem).isRequired,
  userRole: oneOf(['customer', 'provider']).isRequired,
  payinTotal: propTypes.money, // required if userRole === customer
  payoutTotal: propTypes.money, // required if userRole === provider

  // from injectIntl
  intl: intlShape.isRequired,
};

const BookingBreakdown = injectIntl(BookingBreakdownComponent);

BookingBreakdown.displayName = 'BookingBreakdown';

export default BookingBreakdown;
