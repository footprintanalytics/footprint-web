/* eslint-disable react/prop-types */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { t } from "ttag";
import _ from "underscore";
import { set } from "lodash";
import * as Urls from "metabase/lib/urls";
import NeedPermissionModal from "metabase/components/NeedPermissionModal";
import { PLUGIN_SELECTORS } from "metabase/plugins";
// import Bookmark from "metabase/entities/bookmarks";
import Collections from "metabase/entities/collections";
import Timelines from "metabase/entities/timelines";
import { urlAddParam } from "metabase/lib/urls";
import Buffet from "metabase/containers/buffet";
import PublicQuestion from "metabase/public/containers/PublicQuestion";

import { closeNavbar, getIsNavbarOpen } from "metabase/redux/app";
import { getMetadata } from "metabase/selectors/metadata";
import {
  getUser,
  getUserIsAdmin,
  getUserCreateQueryPermission,
  canManageSubscriptions,
} from "metabase/selectors/user";

import { useForceUpdate } from "metabase/hooks/use-force-update";
import { useOnMount } from "metabase/hooks/use-on-mount";
import { useOnUnmount } from "metabase/hooks/use-on-unmount";
import { usePrevious } from "metabase/hooks/use-previous";
import { useLoadingTimer } from "metabase/hooks/use-loading-timer";
import { useWebNotification } from "metabase/hooks/use-web-notification";

import title from "metabase/hoc/Title";
import titleWithLoadingTime from "metabase/hoc/TitleWithLoadingTime";
import favicon from "metabase/hoc/Favicon";

import { chartIdInfo } from "metabase/new-service";
import View from "../components/view/View";

import {
  getCard,
  getDatabasesList,
  getDataReferenceStack,
  getOriginalCard,
  getLastRunCard,
  getFirstQueryResult,
  getQueryResults,
  getParameterValues,
  getIsDirty,
  getIsNew,
  getIsObjectDetail,
  getTables,
  getTableMetadata,
  getTableForeignKeys,
  getTableForeignKeyReferences,
  getUiControls,
  getParameters,
  getDatabaseFields,
  getSampleDatabaseId,
  getNativeDatabases,
  getIsRunnable,
  getIsResultDirty,
  getMode,
  getModalSnippet,
  getSnippetCollectionId,
  getQuery,
  getQuestion,
  getOriginalQuestion,
  getSettings,
  getQueryStartTime,
  getRawSeries,
  getQuestionAlerts,
  getVisualizationSettings,
  getIsNativeEditorOpen,
  getIsVisualized,
  getIsLiveResizable,
  getNativeEditorCursorOffset,
  getNativeEditorSelectedText,
  // getIsBookmarked,
  getVisibleTimelineIds,
  getVisibleTimelineEvents,
  getSelectedTimelineEventIds,
  getFilteredTimelines,
  getTimeseriesXDomain,
  getIsAnySidebarOpen,
  getDocumentTitle,
  getPageFavicon,
  getIsTimeseries,
  getIsLoadingComplete,
  getIsHeaderVisible,
  getIsActionListVisible,
  getIsAdditionalInfoVisible,
  getAutocompleteResultsFn,
  getCardAutocompleteResultsFn,
} from "../selectors";
import * as actions from "../actions";

const timelineProps = {
  query: { include: "events" },
  loadingAndErrorWrapper: false,
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state, props),
    canManageSubscriptions: canManageSubscriptions(state, props),
    isAdmin: getUserIsAdmin(state, props),
    fromUrl: props.location.query.from,

    mode: getMode(state),

    question: getQuestion(state),
    originalQuestion: getOriginalQuestion(state),
    lastRunCard: getLastRunCard(state),

    parameterValues: getParameterValues(state),

    tableForeignKeys: getTableForeignKeys(state),
    tableForeignKeyReferences: getTableForeignKeyReferences(state),

    card: getCard(state),
    originalCard: getOriginalCard(state),
    databases: getDatabasesList(state),
    nativeDatabases: getNativeDatabases(state),
    tables: getTables(state),
    tableMetadata: getTableMetadata(state),

    query: getQuery(state),
    metadata: getMetadata(state),

    timelines: getFilteredTimelines(state),
    timelineEvents: getVisibleTimelineEvents(state),
    visibleTimelineIds: getVisibleTimelineIds(state),
    selectedTimelineEventIds: getSelectedTimelineEventIds(state),
    xDomain: getTimeseriesXDomain(state),

    result: getFirstQueryResult(state),
    results: getQueryResults(state),
    rawSeries: getRawSeries(state),

    uiControls: getUiControls(state),
    ...state.qb.uiControls,
    dataReferenceStack: getDataReferenceStack(state),
    isAnySidebarOpen: getIsAnySidebarOpen(state),

    // isBookmarked: getIsBookmarked(state, props),
    isDirty: getIsDirty(state),
    isNew: getIsNew(state),
    isObjectDetail: getIsObjectDetail(state),
    isNativeEditorOpen: getIsNativeEditorOpen(state),
    isNavBarOpen: getIsNavbarOpen(state),
    isVisualized: getIsVisualized(state),
    isLiveResizable: getIsLiveResizable(state),
    isTimeseries: getIsTimeseries(state),
    isHeaderVisible: getIsHeaderVisible(state),
    isActionListVisible: getIsActionListVisible(state),
    isAdditionalInfoVisible: getIsAdditionalInfoVisible(state),

    parameters: getParameters(state),
    databaseFields: getDatabaseFields(state),
    sampleDatabaseId: getSampleDatabaseId(state),

    isRunnable: getIsRunnable(state),
    isResultDirty: getIsResultDirty(state),

    questionAlerts: getQuestionAlerts(state),
    visualizationSettings: getVisualizationSettings(state),

    autocompleteResultsFn: getAutocompleteResultsFn(state),
    cardAutocompleteResultsFn: getCardAutocompleteResultsFn(state),

    instanceSettings: getSettings(state),

    initialCollectionId: Collections.selectors.getInitialCollectionId(
      state,
      props,
    ),
    queryStartTime: getQueryStartTime(state),
    nativeEditorCursorOffset: getNativeEditorCursorOffset(state),
    nativeEditorSelectedText: getNativeEditorSelectedText(state),
    modalSnippet: getModalSnippet(state),
    snippetCollectionId: getSnippetCollectionId(state),
    documentTitle: getDocumentTitle(state),
    pageFavicon: getPageFavicon(state),
    isLoadingComplete: getIsLoadingComplete(state),
    loadingMessage: PLUGIN_SELECTORS.getLoadingMessage(state),

    canCreate: getUserCreateQueryPermission(state),
  };
};

const mapDispatchToProps = {
  ...actions,
  closeNavbar,
  onChangeLocation: push,
  // createBookmark: id => Bookmark.actions.create({ id, type: "card" }),
  // deleteBookmark: id => Bookmark.actions.delete({ id, type: "card" }),
};

function QueryBuilder(props) {
  const {
    question,
    location,
    params,
    fromUrl,
    uiControls,
    isNativeEditorOpen,
    isAnySidebarOpen,
    closeNavbar,
    initializeQB,
    apiCreateQuestion,
    apiUpdateQuestion,
    updateUrl,
    locationChanged,
    onChangeLocation,
    setUIControls,
    cancelQuery,
    // isBookmarked,
    // createBookmark,
    // deleteBookmark,
    allLoaded,
    showTimelinesForCollection,
    card,
    isLoadingComplete,
    user,
    router,
    reloadUserVip,
    canCreate,
  } = props;

  const [uuid, setUuid] = useState();
  const [error, setError] = useState();
  const [showVip, setShowVip] = useState();
  const forceUpdate = useForceUpdate();
  const forceUpdateDebounced = useMemo(
    () => _.debounce(forceUpdate, 400),
    [forceUpdate],
  );
  const timeout = useRef(null);

  const previousUIControls = usePrevious(uiControls);
  const previousLocation = usePrevious(location);
  const wasShowingAnySidebar = usePrevious(isAnySidebarOpen);
  const wasNativeEditorOpen = usePrevious(isNativeEditorOpen);
  const hasQuestion = question != null;
  const collectionId = question?.collectionId();

  const openModal = useCallback(
    (modal, modalContext) => setUIControls({ modal, modalContext }),
    [setUIControls],
  );

  const closeModal = useCallback(
    () => setUIControls({ modal: null, modalContext: null }),
    [setUIControls],
  );

  const setRecentlySaved = useCallback(
    recentlySaved => {
      setUIControls({ recentlySaved });
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        setUIControls({ recentlySaved: null });
      }, 5000);
    },
    [setUIControls],
  );

  // const onClickBookmark = () => {
  //   const {
  //     card: { id },
  //   } = props;
  //
  //   const toggleBookmark = isBookmarked ? deleteBookmark : createBookmark;
  //
  //   toggleBookmark(id);
  // };

  const handleCreate = useCallback(
    async card => {

      await reloadUserVip();
      if (!canCreate) {
        setShowVip(true);
        throw { data: "" };
      }
      const shouldBePinned = Boolean(card.dataset);

      const questionWithUpdatedCard = question
        .setCard(card)
        .setPinned(shouldBePinned);

      await apiCreateQuestion(questionWithUpdatedCard);

      setRecentlySaved("created");
    },
    [reloadUserVip, canCreate, question, apiCreateQuestion, setRecentlySaved],
  );

  const handleSave = useCallback(
    async (card, { rerunQuery = false } = {}) => {
      const questionWithUpdatedCard = question.setCard(card);
      await apiUpdateQuestion(questionWithUpdatedCard, { rerunQuery });
      if (!rerunQuery) {
        await updateUrl(questionWithUpdatedCard.card(), { dirty: false });
      }
      if (fromUrl) {
        onChangeLocation(fromUrl);
      } else {
        setRecentlySaved("updated");
      }
    },
    [
      question,
      fromUrl,
      apiUpdateQuestion,
      updateUrl,
      onChangeLocation,
      setRecentlySaved,
    ],
  );

  useOnMount(() => {
    initializeQB(location, params);
  }, []);

  useOnMount(() => {
    handleChartProcess(user);
  }, []);

  useOnMount(() => {
    window.addEventListener("resize", forceUpdateDebounced);
    return () => window.removeEventListener("resize", forceUpdateDebounced);
  }, []);

  const handleChartProcess = async (user) => {
    if (location.hash && !user) {
      router.push(`/loginModal`);
      return;
    }
    const cardId = Urls.extractEntityId(params.slug);
    if (!cardId) {
      init();
    } else {
      try {
        const { uuid, metabaseId } = await chartIdInfo({
          id: cardId,
        });
        const canEditInfo =
          user && (metabaseId === user.id || user.is_superuser);
        if (canEditInfo) {
          setUuid(null,
            () => {
              init();
            },
          );
        } else {
          setUuid(uuid);
        }
      } catch (error) {
        setError(error);
      }
    }
  }

  const init = async () => {
    await initializeQB(
      location,
      params,
      location.query,
    );
    handleDefaultEditAction();
  }

  const handleDefaultEditAction = () => {
    if (location.query.editingOnLoad) {
      history.replaceState(
        null,
        document.title,
        urlAddParam(window.location.href, "editingOnLoad"),
      );
      set(question, "_card.original_card_id", card.id);
      question.update(null, { shouldUpdateUrl: true });
    }
  }

  useOnUnmount(() => {
    cancelQuery();
    closeModal();
    clearTimeout(timeout.current);
  });

  useEffect(() => {
    if (
      (isAnySidebarOpen && !wasShowingAnySidebar) ||
      (isNativeEditorOpen && !wasNativeEditorOpen)
    ) {
      closeNavbar();
    }
  }, [
    isAnySidebarOpen,
    wasShowingAnySidebar,
    isNativeEditorOpen,
    wasNativeEditorOpen,
    closeNavbar,
  ]);

  useEffect(() => {
    if (allLoaded && hasQuestion) {
      showTimelinesForCollection(collectionId);
    }
  }, [allLoaded, hasQuestion, collectionId, showTimelinesForCollection]);

  useEffect(() => {
    const { isShowingDataReference, isShowingTemplateTagsEditor } = uiControls;
    const {
      isShowingDataReference: wasShowingDataReference,
      isShowingTemplateTagsEditor: wasShowingTemplateTagsEditor,
    } = previousUIControls ?? {};

    if (
      isShowingDataReference !== wasShowingDataReference ||
      isShowingTemplateTagsEditor !== wasShowingTemplateTagsEditor
    ) {
      // when the data reference is toggled we need to trigger a rerender after a short delay in order to
      // ensure that some components are updated after the animation completes (e.g. card visualization)
      timeout.current = setTimeout(forceUpdateDebounced, 300);
    }
  }, [uiControls, previousUIControls, forceUpdateDebounced]);

  useEffect(() => {
    if (previousLocation && location !== previousLocation) {
      locationChanged(previousLocation, location, params);
    }
  }, [location, params, previousLocation, locationChanged]);

  const [isShowingToaster, setIsShowingToaster] = useState(false);

  const { isRunning } = uiControls;

  const onTimeout = useCallback(() => {
    if ("Notification" in window && Notification.permission === "default") {
      setIsShowingToaster(true);
    }
  }, []);

  useLoadingTimer(isRunning, {
    timer: 15000,
    onTimeout,
  });

  const [requestPermission, showNotification] = useWebNotification();

  useEffect(() => {
    if (isLoadingComplete) {
      setIsShowingToaster(false);

      if (
        "Notification" in window &&
        Notification.permission === "granted" &&
        document.hidden
      ) {
        showNotification(
          t`All Set! Your question is ready.`,
          t`${card.name} is loaded.`,
        );
      }
    }
  }, [isLoadingComplete, showNotification, card?.name]);

  const onConfirmToast = useCallback(async () => {
    await requestPermission();
    setIsShowingToaster(false);
  }, [requestPermission]);

  const onDismissToast = useCallback(() => {
    setIsShowingToaster(false);
  }, []);

  if (location.pathname.includes("/chart/buffet")) {
    return <Buffet {...props} />;
  }

  const renderModal = showVip => {
    return (
      showVip && (
        <NeedPermissionModal
          title="Your account has reached the limit of number of query, please upgrade the account to unlock more"
          onClose={() => setShowVip({ showVip: false })}
        />
      )
    );
  };
  if (uuid) {
    return <PublicQuestion {...props} uuid={uuid} />;
  }
  console.log("pppp")
  return (
    <div className="relative flex flex-full flex-column">
    <View
      {...props}
      modal={uiControls.modal}
      recentlySaved={uiControls.recentlySaved}
      onOpenModal={openModal}
      onCloseModal={closeModal}
      onSetRecentlySaved={setRecentlySaved}
      onSave={handleSave}
      onCreate={handleCreate}
      handleResize={forceUpdateDebounced}
      // toggleBookmark={onClickBookmark}
      onDismissToast={onDismissToast}
      onConfirmToast={onConfirmToast}
      isShowingToaster={isShowingToaster}
      error={error}
    />
      {renderModal(showVip)}
    </div>
  );
}

export default _.compose(
  // Bookmark.loadList(),
  Timelines.loadList(timelineProps),
  connect(mapStateToProps, mapDispatchToProps),
  favicon(({ pageFavicon }) => pageFavicon),
  title(({ card, documentTitle }) => ({
    title: documentTitle || card?.name || t`Question`,
    titleIndex: 1,
  })),
  titleWithLoadingTime("queryStartTime"),
)(QueryBuilder);
