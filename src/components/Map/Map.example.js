import React from 'react';
import Map from './Map';
import { types as sdkTypes } from '../../util/sdkLoader';

const { LatLng } = sdkTypes;

export const Empty = {
  component: props => (
    <div style={{ height: 400 }}>
      <Map {...props} />
    </div>
  ),
  props: {
    center: new LatLng(60.16502999999999, 24.940064399999983),
    address: 'Sharetribe',
    zoom: 22,
  },
};
