import { getProject, isDefi360 } from "metabase/lib/project_info";

const getCollectionIdByName = (user, projectName) => {
  const collection = user.personal_collection.find(
    item => item.projectName === projectName,
  );
  return collection ? collection.collectionId : user.personal_collection_id;
};

export const getPersonalCollectionId = (user, location = window.location) => {
  if (!user) {
    return null;
  }
  const project = getProject(location);
  if (!user.personal_collection) {
    return user.personal_collection_id;
  }
  if (isDefi360(project)) {
    return getCollectionIdByName(user, "DeFi360");
  }
  return getCollectionIdByName(user, "Footprint");
};
