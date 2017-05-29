/* eslint-disable no-console */
import EditListingLocationForm from './EditListingLocationForm';

export const Empty = {
  component: EditListingLocationForm,
  props: {
    onSubmit: values => {
      console.log('Submit EditListingLocationForm with (unformatted) values:', values);
    },
  },
  group: 'forms',
};
