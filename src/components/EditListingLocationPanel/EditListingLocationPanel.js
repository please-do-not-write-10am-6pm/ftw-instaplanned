import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { ensureListing, parseAddress } from '../../util/data';
import { createSlug } from '../../util/urlHelpers';
import { NamedLink } from '../../components';
import { EditListingLocationForm } from '../../containers';

import css from './EditListingLocationPanel.css';

const EditListingLocationPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureListing(listing);
  const { address, geolocation, title } = currentListing.attributes;
  const listingTitle = title || '';
  const listingLink = currentListing.id
    ? <NamedLink
        name="ListingPage"
        params={{ id: currentListing.id.uuid, slug: createSlug(title) }}
      >
        {listingTitle}
      </NamedLink>
    : '';

  const panelTitle = currentListing.id
    ? <FormattedMessage
        id="EditListingLocationPanel.title"
        values={{ listingTitle: listingLink }}
      />
    : <FormattedMessage id="EditListingLocationPanel.createListingTitle" />;

  // Only render current search if full place object is available in the URL params
  // TODO bounds and country are missing - those need to be queried directly from Google Places
  const locationFieldsPresent = address && geolocation;

  // TODO location address is currently serialized inside address field (API will change later)
  // Content is something like { locationAddress: 'Street, Province, Country', building: 'A 42' };
  const { locationAddress, building } = parseAddress(address);

  const initialSearchFormValues = {
    building,
    location: locationFieldsPresent
      ? {
          search: locationAddress,
          selectedPlace: { address: locationAddress, origin: geolocation },
        }
      : null,
  };

  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      <EditListingLocationForm
        className={css.form}
        initialValues={initialSearchFormValues}
        onSubmit={onSubmit}
        onChange={onChange}
        saveActionMsg={submitButtonText}
        updated={panelUpdated}
        updateError={errors.updateListingError}
        updateInProgress={updateInProgress}
      />
    </div>
  );
};

const { func, object, string, bool } = PropTypes;

EditListingLocationPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingLocationPanel.propTypes = {
  className: string,
  rootClassName: string,
  listing: object, // TODO Should be propTypes.listing after API support is added.
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingLocationPanel;
