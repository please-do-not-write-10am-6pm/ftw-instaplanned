import React from 'react';
import PropTypes from 'prop-types';
import css from './Logo.module.css';

const IconLogo = props => {
  const { className, format, ...rest } = props;

  if (format === 'desktop') {
    return (
      <div className={className} {...rest} width="141" height="26" viewBox="0 0 141 26">
        <span className={css.logoMobile}>LOGO</span>
      </div>
    );
  }

  return (
    <div className={className} {...rest} width="28" height="26" viewBox="0 0 28 26">
      <span className={css.logoDesktop}>LOGO</span>
    </div>
  );
};

const { string } = PropTypes;

IconLogo.defaultProps = {
  className: null,
};

IconLogo.propTypes = {
  className: string,
};

export default IconLogo;
