import { createEntity } from "metabase/lib/entities";

import { GET } from "metabase/lib/api";

import {
  ENTITIES_SCHEMA_MAP,
  entityTypeForObject,
  ObjectUnionSchema,
} from "metabase/schema";

const ENTITIES_TYPES = Object.keys(ENTITIES_SCHEMA_MAP);

const searchList = GET("/api/v1/home/search");

export default createEntity({
  name: "searchNav",
  path: "/api/v1/home/search",

  api: {
    list: async (query = {}) => searchList(query),
  },

  schema: ObjectUnionSchema,

  // delegate to the actual object's entity wrapEntity
  wrapEntity(object, dispatch = null) {
    const entities = require("metabase/entities");
    const entity = entities[entityTypeForObject(object)];
    if (entity) {
      return entity.wrapEntity(object, dispatch);
    } else {
      console.warn("Couldn't find entity for object", object);
      return object;
    }
  },

  // delegate to each entity's actionShouldInvalidateLists
  actionShouldInvalidateLists(action) {
    const entities = require("metabase/entities");
    for (const type of ENTITIES_TYPES) {
      if (entities[type].actionShouldInvalidateLists(action)) {
        return true;
      }
    }
    return false;
  },
});
