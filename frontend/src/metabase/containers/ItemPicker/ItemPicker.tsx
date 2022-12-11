import React, { useCallback, useMemo, useState, useEffect } from "react";
import _ from "underscore";
import { connect } from "react-redux";

import { IconProps } from "metabase/components/Icon";

import { getCrumbs } from "metabase/lib/collections";

import Collections from "metabase/entities/collections";

import { entityListLoader } from "metabase/entities/containers/EntityListLoader";
import { entityObjectLoader } from "metabase/entities/containers/EntityObjectLoader";
import { isRootCollection } from "metabase/collections/utils";

import { getPersonalCollectionId } from "metabase/lib/collection";
import { getUser } from "metabase/home/selectors";
import { getProject } from "metabase/lib/project_info";

import type { Collection } from "metabase-types/api";
import type { State } from "metabase-types/store";

import type {
  CollectionPickerItem,
  PickerItem,
  PickerModel,
  PickerValue,
  SearchQuery,
} from "./types";

import ItemPickerView from "./ItemPickerView";
import { ScrollAwareLoadingAndErrorWrapper } from "./ItemPicker.styled";
import { useOnMount } from "../../hooks/use-on-mount";

interface OwnProps {
  value?: PickerValue;
  models: PickerModel[];
  entity?: typeof Collections; // collections/snippets entity
  showSearch?: boolean;
  showScroll?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onChange: (value: PickerValue) => void;
  user: any;
}

interface StateProps {
  collectionsById: Record<Collection["id"], Collection>;
  getCollectionIcon: (collection: Collection) => IconProps;
}

type Props = OwnProps & StateProps;

function canWriteToCollectionOrChildren(collection: Collection) {
  return (
    collection.can_write ||
    collection.children?.some(canWriteToCollectionOrChildren)
  );
}

const createEntityQuery = (state: any, props: any) => {
  return {
    project: getProject(),
    ...(props.models && props.models.includes("dashboard")
      ? { queryType: "dashboard" }
      : {}),
  };
};

function mapStateToProps(state: State, props: OwnProps) {
  const entity = props.entity || Collections;
  return {
    collectionsById: entity.selectors.getExpandedCollectionsById(state, {
      collectionsIdsKey: JSON.stringify(createEntityQuery(state, props)),
    }),
    getCollectionIcon: entity.objectSelectors.getIcon,
    user: getUser(state),
  };
}

function getEntityLoaderType(state: State, props: OwnProps) {
  return props.entity?.name ?? "collections";
}

function getItemId(item: PickerItem | PickerValue) {
  if (!item) {
    return;
  }
  if (item.model === "collection") {
    return item.id === null ? "root" : item.id;
  }
  return item.id;
}

function ItemPicker({
  value,
  models,
  collectionsById,
  className,
  showSearch = true,
  showScroll = true,
  style,
  onChange,
  getCollectionIcon,
  user,
}: Props) {
  const [openCollectionId, setOpenCollectionId] =
    useState<Collection["id"]>("root");
  const [searchString, setSearchString] = useState("");

  const isPickingNotCollection = models.some(model => model !== "collection");

  const openCollection = collectionsById[openCollectionId];

  const collections = useMemo(() => {
    let list = openCollection?.children || [];

    // show root in itself if we can pick it
    /*if (
      openCollection &&
      isRootCollection(openCollection) &&
      models.includes("collection")
    ) {
      list = [openCollection, ...list];
    }*/

    const collectionItems = list
      .filter(canWriteToCollectionOrChildren)
      .map(collection => ({
        ...collection,
        model: "collection",
      }));

    return collectionItems as CollectionPickerItem[];
  }, [openCollection, models]);

  const crumbs = useMemo(
    () =>
      getCrumbs(openCollection, collectionsById, id => setOpenCollectionId(id)),
    [openCollection, collectionsById],
  );

  const searchQuery = useMemo(() => {
    const query: SearchQuery = {};

    if (searchString) {
      query.q = searchString;
    } else {
      query.collection = openCollectionId;
    }

    if (models.length === 1) {
      query.models = models;
    }

    return query;
  }, [models, searchString, openCollectionId]);

  const checkIsItemSelected = useCallback(
    (item: PickerItem) => {
      if (!value || !item) {
        return false;
      }
      const isSameModel = item.model === value.model || models.length === 1;
      return isSameModel && getItemId(item) === getItemId(value);
    },
    [value, models],
  );

  const checkCollectionMaybeHasChildren = useCallback(
    (collection: CollectionPickerItem) => {
      if (isPickingNotCollection) {
        // Non-collection models (e.g. questions, dashboards)
        // are loaded on-demand so we don't know ahead of time
        // if they have children, so we have to assume they do
        return true;
      }

      if (isRootCollection(collection)) {
        // Skip root as we don't show root's sub-collections alongside it
        return false;
      }

      return (
        Array.isArray(collection.children) && collection.children.length > 0
      );
    },
    [isPickingNotCollection],
  );

  const checkHasWritePermissionForItem = useCallback(
    (item: PickerItem) => {
      // if user is selecting a collection, they must have a `write` access to it
      if (models.includes("collection") && item.model === "collection") {
        return item.can_write;
      }

      // if user is selecting something else (e.g. dashboard),
      // they must have `write` access to a collection item belongs to
      const collection = item.collection_id
        ? collectionsById[item.collection_id]
        : collectionsById["root"];
      return collection && collection.can_write;
    },
    [models, collectionsById],
  );

  const handleChange = useCallback(
    (item: PickerItem) => {
      if (
        item.model === "collection" &&
        isRootCollection(item as unknown as Collection)
      ) {
        onChange({ id: null, model: "collection" });
      } else {
        onChange(item);
      }
    },
    [onChange],
  );

  const handleCollectionOpen = useCallback(collectionId => {
    setOpenCollectionId(collectionId);
  }, []);

  const initDashboardAndCardParentId = () => {
    if (
      (models.includes("dashboard") || models.includes("card")) &&
      collectionsById
    ) {
      setOpenCollectionId(getPersonalCollectionId(user));
    }
  }

  const initCollectionParentId = () => {
    let parentId: any = openCollectionId;
    if (!value) {
      return;
    }
    const { model, id } = value;
    if (model !== "collection") {
      return;
    }
    if (id && collections) {
      const { location } = collectionsById[id];
      if (location && location !== "/") {
        const words = location.split("/");
        if (words && words.length > 1) {
          parentId = words[words.length - 2];
          setOpenCollectionId(parentId);
        }
      }
    }
  }

  useOnMount(() => {
    initCollectionParentId();
    initDashboardAndCardParentId();
  })

  /*useEffect(() => {
    initCollectionParentId();
    initDashboardAndCardParentId();
  }, [collections]);*/

  return (
    <ScrollAwareLoadingAndErrorWrapper
      loading={!collectionsById}
      hasScroll={showScroll}
    >
      <ItemPickerView
        className={className}
        models={models}
        openCollection={openCollection}
        collections={collections}
        searchString={searchString}
        searchQuery={searchQuery}
        showSearch={showSearch}
        crumbs={crumbs}
        onChange={handleChange}
        onSearchStringChange={setSearchString}
        onOpenCollectionChange={handleCollectionOpen}
        checkCollectionMaybeHasChildren={checkCollectionMaybeHasChildren}
        checkIsItemSelected={checkIsItemSelected}
        checkHasWritePermissionForItem={checkHasWritePermissionForItem}
        getCollectionIcon={getCollectionIcon}
        style={style}
      />
    </ScrollAwareLoadingAndErrorWrapper>
  );
}

export default _.compose(
  entityObjectLoader({
    id: "root",
    entityType: getEntityLoaderType,
    entityQuery: (state: any, props: any) => createEntityQuery(state, props),
    loadingAndErrorWrapper: false,
  }),
  entityListLoader({
    entityType: getEntityLoaderType,
    entityQuery: (state: any, props: any) => createEntityQuery(state, props),
    loadingAndErrorWrapper: false,
  }),
  connect(mapStateToProps),
)(ItemPicker);
