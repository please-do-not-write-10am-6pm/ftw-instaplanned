import { reduce } from 'lodash';

/**
 * Combine the given relationships objects
 *
 * See: http://jsonapi.org/format/#document-resource-object-relationships
 */
export const combinedRelationships = (oldRels, newRels) => {
  if (!oldRels && !newRels) {
    // Special case to avoid adding an empty relationships object when
    // none of the resource objects had any relationships.
    return null;
  }
  return { ...oldRels, ...newRels };
};

/**
 * Combine the given resource objects
 *
 * See: http://jsonapi.org/format/#document-resource-objects
 */
export const combinedResourceObjects = (oldRes, newRes) => {
  const { id, type } = oldRes;
  if (newRes.id.uuid !== id.uuid || newRes.type !== type) {
    throw new Error('Cannot merge resource objects with different ids or types');
  }
  const attributes = newRes.attributes || oldRes.attributes;
  const attrs = attributes ? { attributes } : null;
  const relationships = combinedRelationships(oldRes.relationships, newRes.relationships);
  const rels = relationships ? { relationships } : null;
  return { id, type, ...attrs, ...rels };
};

/**
 * Combine the resource objects form the given api response to the
 * existing entities.
 */
export const updatedEntities = (oldEntities, apiResponse) => {
  const { data, included = [] } = apiResponse;
  const objects = (Array.isArray(data) ? data : [data]).concat(included);

  /* eslint-disable no-param-reassign */
  const newEntities = objects.reduce(
    (entities, curr) => {
      const { id, type } = curr;
      entities[type] = entities[type] || {};
      const entity = entities[type][id.uuid];
      entities[type][id.uuid] = entity ? combinedResourceObjects(entity, curr) : curr;
      return entities;
    },
    oldEntities
  );
  /* eslint-enable no-param-reassign */

  return newEntities;
};

/**
 * Denormalise the entities with the given IDs from the entities object
 *
 * This function calculates the dernormalised tree structure from the
 * normalised entities object with all the relationships joined in.
 *
 * @param {Object} entities entities object in the SDK Redux store
 * @param {String} type entity type of the given IDs
 * @param {Array<UUID>} ids IDs to pick from the entities
 */
export const denormalisedEntities = (entities, type, ids) => {
  if (!entities[type] && ids.length > 0) {
    throw new Error(`No entities of type ${type}`);
  }
  return ids.map(id => {
    const entity = entities[type][id.uuid];
    if (!entity) {
      throw new Error(`Entity ${type} with id ${id.uuid} not found`);
    }
    const { relationships, ...entityData } = entity;

    if (relationships) {
      // Recursively join in all the relationship entities
      return reduce(
        relationships,
        (ent, relRef, relName) => {
          // A relationship reference can be either a single object or
          // an array of objects. We want to keep that form in the final
          // result.
          const hasMultipleRefs = Array.isArray(relRef.data);
          const multipleRefsEmpty = hasMultipleRefs && relRef.data.length === 0;
          if (!relRef.data || multipleRefsEmpty) {
            // eslint-disable-next-line no-param-reassign
            ent[relName] = hasMultipleRefs ? [] : null;
          } else {
            const refs = hasMultipleRefs ? relRef.data : [relRef.data];
            const relIds = refs.map(ref => ref.id);
            const relType = refs[0].type;
            const rels = denormalisedEntities(entities, relType, relIds);

            // eslint-disable-next-line no-param-reassign
            ent[relName] = hasMultipleRefs ? rels : rels[0];
          }
          return ent;
        },
        entityData
      );
    }
    return entityData;
  });
};

/**
 * Create shell objects to ensure that attributes etc. exists.
 *
 * @param {Object} transaction entity object, which is to be ensured agains null values
 */
export const ensureTransaction = (transaction, booking = {}, listing = {}, provider = {}) => {
  const empty = {
    id: null,
    type: 'transaction',
    attributes: {},
    booking,
    listing,
    provider,
  };
  return { ...empty, ...transaction };
};

/**
 * Create shell objects to ensure that attributes etc. exists.
 *
 * @param {Object} booking entity object, which is to be ensured agains null values
 */
export const ensureBooking = booking => {
  const empty = { id: null, type: 'booking', attributes: {} };
  return { ...empty, ...booking };
};

/**
 * Create shell objects to ensure that attributes etc. exists.
 *
 * @param {Object} listing entity object, which is to be ensured agains null values
 */
export const ensureListing = listing => {
  const empty = { id: null, type: 'listing', attributes: {}, images: [] };
  return { ...empty, ...listing };
};

/**
 * Create shell objects to ensure that attributes etc. exists.
 *
 * @param {Object} user entity object, which is to be ensured agains null values
 */
export const ensureUser = user => {
  const empty = { id: null, type: 'user', attributes: { profile: {} } };
  return { ...empty, ...user };
};

/**
 * Create shell objects to ensure that attributes etc. exists.
 *
 * @param {Object} current user entity object, which is to be ensured agains null values
 */
export const ensureCurrentUser = user => {
  const empty = { id: null, type: 'current-user', attributes: { profile: {} }, profileImage: {} };
  return { ...empty, ...user };
};

/**
 * Get the display name of the given user. This function handles
 * missing data (e.g. when the user object is still being downloaded),
 * fully loaded users, as well as banned users.
 *
 * For banned users, a translated name should be provided.
 *
 * @param {propTypes.user} user
 * @param {String} bannedUserDisplayName
 *
 * @return {String} display name that can be rendered in the UI
 */
export const userDisplayName = (user, bannedUserDisplayName) => {
  const hasAttributes = user && user.attributes;
  const hasProfile = hasAttributes && user.attributes.profile;

  if (hasAttributes && user.attributes.banned) {
    return bannedUserDisplayName;
  } else if (hasProfile) {
    return user.attributes.profile.displayName;
  } else {
    return '';
  }
};

/**
 * Get the abbreviated name of the given user. This function handles
 * missing data (e.g. when the user object is still being downloaded),
 * fully loaded users, as well as banned users.
 *
 * For banned users, a translated name should be provided.
 *
 * @param {propTypes.user} user
 * @param {String} bannedUserAbbreviatedName
 *
 * @return {String} abbreviated name that can be rendered in the UI
 * (e.g. in Avatar initials)
 */
export const userAbbreviatedName = (user, bannedUserAbbreviatedName) => {
  const hasAttributes = user && user.attributes;
  const hasProfile = hasAttributes && user.attributes.profile;

  if (hasAttributes && user.attributes.banned) {
    return bannedUserAbbreviatedName;
  } else if (hasProfile) {
    return user.attributes.profile.abbreviatedName;
  } else {
    return '';
  }
};

/**
 * Temporary utility function to parse address field.
 * Location address is currently serialized inside address field.
 *
 * TODO: address will be moved to custom field, when API supports custom fields.
 */
export const parseAddress = address => {
  if (!(typeof address === 'string' || address == null)) {
    throw new Error('Address must be a string.');
  }

  // Content is serialized as { locationAddress: 'Street, Province, Country', building: 'A 42' };
  let locationAddress = '';
  let building = '';
  try {
    const deserializedAddress = JSON.parse(address || '{}');
    locationAddress = deserializedAddress.locationAddress || '';
    building = deserializedAddress.building || '';
  } catch (e) {
    locationAddress = address;
  }
  return { locationAddress, building };
};
