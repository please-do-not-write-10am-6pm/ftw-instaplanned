import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { EditListingDescriptionForm } from '../../containers';

import css from './EditListingDescriptionPanel.css';

const EditListingDescriptionPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    errors,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const { attributes: { description, title } } = listing || { attributes: {} };

  return (
    <div className={classes}>
      <h1 className={css.title}><FormattedMessage id="EditListingDescriptionPanel.title" /></h1>
      <EditListingDescriptionForm
        className={css.form}
        initialValues={{ title, description }}
        saveActionMsg={submitButtonText}
        onSubmit={onSubmit}
        onChange={onChange}
        updated={panelUpdated}
        updateError={errors.updateListingError}
      />
    </div>
  );
};

const { func, object, string, bool } = PropTypes;

EditListingDescriptionPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingDescriptionPanel.propTypes = {
  className: string,
  rootClassName: string,
  listing: object, // TODO Should be propTypes.listing after API support is added.
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingDescriptionPanel;
