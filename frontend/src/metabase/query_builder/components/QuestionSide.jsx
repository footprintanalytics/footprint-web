/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import Database from "metabase/entities/databases";
import { withRouter } from "react-router";
import { replace } from "react-router-redux";
import { Flex } from "grid-styled";
import { get, words } from "lodash";
import { compose } from "underscore";
import { t } from "ttag";
import * as Urls from "metabase/lib/urls";
import { getMetadata } from "metabase/selectors/metadata";
import { getProject } from "metabase/lib/project_info";
import { tableSearchV2 } from "metabase/new-service";
import "./QuestionSide.css";
import {
  getNativeEditorCursorOffset,
  getNativeEditorSelectedText,
  getQuery,
  getQuestion,
} from "../selectors";
import NativeQuery from "metabase-lib/lib/queries/NativeQuery";
import { deserializeCardFromUrl } from "metabase/lib/card";
import ConfirmContent from "metabase/components/ConfirmContent";
import Modal from "metabase/components/Modal";
import { questionSideHideAction } from "metabase/redux/config";
import {
  closeAllChartPopoverAction,
  nextChartPopoverAction,
  setNewGuideInfo,
  setShowPreviewChart,
} from "metabase/redux/control";
import { updateNativeEditorSelect } from "metabase/query_builder/utils/handle";
import {
  handleNewGuideTableData,
  handleTableListData,
  handleTableListDataByCategory,
  isInitHash,
} from "metabase/query_builder/components/question/handle";
import TableDataList from "metabase/query_builder/components/question/TableDataList";
import TableDatabase from "metabase/query_builder/components/question/TableDatabase";
import Link from "metabase/components/Link";
import { UploadOutlined } from "@ant-design/icons";
import { getUser } from "metabase/selectors/user";
import {
  canShowNewGuideStart,
  closeNewGuide,
  newGuideHandle,
  newGuideHighlight,
} from "metabase/containers/newguide/newGuide";
import { getNewGuideInfo } from "metabase/selectors/control";
import TableSearch from "metabase/query_builder/components/question/TableSearch";
import NewGuideStartModal from "metabase/containers/newguide/NewGuideStartModal";
import TableCategory from "metabase/query_builder/components/question/TableCategory";
import { useQuery } from "react-query";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import dateFieldMapping from "metabase/query_builder/data/data";

function QuestionSide({
  question,
  databases,
  dbId,
  replace,
  query,
  card,
  isEditing,
  nativeEditorCursorOffset,
  nativeEditorSelectedText,
  handleQuestionSideHide,
  closeTemplateData,
  closeAllChartPopoverAction,
  formDataSelector,
  selectTableAction,
  setShowPreviewChart,
  user,
  getNewGuideInfo,
  setNewGuideInfo,
  nextChartPopoverAction,
}) {
  const [databaseId, setDatabaseId] = useState(dbId || 3);
  const [handleSelectTable, setHandleSelectTable] = useState();
  const [category, setCategory] = useState();
  const [moreParams, setMoreParams] = useState();
  const [searchKey, setSearchKey] = useState("");
  // const [dataSets, setDatasets] = useState([]);
  const [nextTableObject, setNextTableObject] = useState({});
  const [confirmModal, setConfirmModal] = useState(false);
  const [showNewGuideStart, setShowNewGuideStart] = useState(false);
  const isNative = query instanceof NativeQuery;
  const sourceTableId = get(card, "dataset_query.query.source-table");
  const pageSize = 10;
  const canShowNewGuide = canShowNewGuideStart(user);
  const newGuideShowTable = getNewGuideInfo && getNewGuideInfo["table"];
  const queryType = get(card, "dataset_query.type");
  const isNewQuestion = !get(question, "_card.original_card_id");
  const searchKeyValue = searchKey.trim().toLowerCase();

  const qString = words(searchKeyValue, /[^ ]+/g)
    .map(s => s.trim())
    .filter(s => s !== "");

  const qs = qString.length > 0 ? qString : null;

  const params = {
    databaseId,
    qs,
    project: getProject(),
    queryType: queryType,
    filterCategories: category ? [category] : null,
  };

  const { isLoading, data } = useQuery(
    ["tableSearchV2", databaseId, category, qs],
    async () => {
      return await tableSearchV2(params);
    },
    QUERY_OPTIONS,
  );

  const isByCategory = data?.isByCategory; //

  const handleTableListDataFunction = isByCategory
    ? handleTableListDataByCategory
    : handleTableListData;

  const updateMoreListData = (dataSets, params) => {
    if (!params) {
      return dataSets;
    }
    const { key, moreData } = params;
    return dataSets?.map(dataSet => {
      let dataSetAddData;
      if (dataSet?.category?.value === key) {
        dataSetAddData = moreData;
      }
      return {
        ...dataSet,
        ...dataSetAddData,
      };
    });
  };

  const dataSets = useMemo(
    () =>
      updateMoreListData(
        data?.list && handleTableListDataFunction(data?.list),
        moreParams,
      ),
    [data?.list, handleTableListDataFunction, moreParams],
  );

  useEffect(() => {
    if (newGuideShowTable && dataSets?.length > 0) {
      newGuideHighlight({ key: "table", getNewGuideInfo, setNewGuideInfo });
    }
  }, [newGuideShowTable, dataSets, getNewGuideInfo, setNewGuideInfo]);

  const getFilter = ({ tableName, columns }) => {
    let filter = null;
    const mapping = dateFieldMapping.find(
      mapping => mapping.tableName === tableName,
    );
    if (mapping && columns) {
      const { dateField } = mapping;
      const dateColumn = columns.find(column => column.name === dateField);
      if (dateColumn) {
        filter = ["time-interval", ["field", dateColumn.id, null], -7, "day"];
      }
    }
    return filter;
  };

  const replaceUrl = ({ tableId, type = "query", filter }) => {
    replace(
      Urls.newQuestion({ databaseId, tableId, type, filter, limit: 2000 }),
    );
  };

  useEffect(() => {
    if (handleSelectTable) {
      const { tableId, tableName, columnName, columns } = handleSelectTable;
      closeNewGuide({ key: "table" });
      if (selectTableAction) {
        selectTableAction({ tableId, tableName, columnName });
        return;
      }
      if (isEditing) {
        return;
      }
      setNextTableObject({ tableId, tableName, columns });
      if (isNative) {
        updateNativeEditorSelect({
          databaseId,
          tableName,
          columnName,
          query,
          question,
          nativeEditorCursorOffset,
          nativeEditorSelectedText,
        });
        return;
      }
      if (!isInitHash({ sourceTableId, databaseId })) {
        setConfirmModal(true);
        return;
      }
      const filter = getFilter({ tableName, columns });
      replaceUrl({ tableId, filter });
      afterAction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleSelectTable]);

  const afterAction = () => {
    setTimeout(() => {
      closeTemplateData();
      closeAllChartPopoverAction({ time: new Date().getTime() });
      hideQuestionSide();
      setShowPreviewChart({ show: false });
    }, 10);
  };

  const hideQuestionSide = () => {
    setTimeout(() => {
      handleQuestionSideHide({ hide: true });
    }, 500);
  };

  const UploadData = () => {
    if (formDataSelector) {
      return null;
    }

    return (
      <Link to="/chart/custom-upload" className="question-side__custom-upload">
        <UploadOutlined />
        Upload Data
      </Link>
    );
  };

  const categoryChange = value => {
    setCategory(value);
  };

  return (
    <Flex
      p={15}
      flexDirection="column"
      className="full-height overflow-auto relative"
    >
      {!formDataSelector && (
        <TableDatabase
          setDatabaseId={setDatabaseId}
          card={card}
          replace={replace}
          databases={databases}
          isEditing={isEditing}
          databaseId={databaseId}
        />
      )}
      <TableSearch
        isEditing={isEditing}
        setSearchKey={setSearchKey}
        searchKey={searchKey}
        searchKeyValue={searchKeyValue}
        searchLoading={searchKeyValue.length > 0 && isLoading}
        databaseId={databaseId}
        formDataSelector={formDataSelector}
        handleSelectTable={handleSelectTable}
      />
      {!formDataSelector && (
        <TableCategory
          databaseId={databaseId}
          categoryChange={categoryChange}
          category={category}
        />
      )}
      <>
        <TableDataList
          isLoading={isLoading}
          isFeature={data?.isFeature}
          dataSets={
            canShowNewGuide ? handleNewGuideTableData(dataSets) : dataSets
          }
          isEditing={isEditing}
          handleSelectTable={useCallback(setHandleSelectTable, [
            setHandleSelectTable,
          ])}
          setShowPreviewChart={useCallback(setShowPreviewChart, [
            setShowPreviewChart,
          ])}
          closeTemplateData={closeTemplateData}
          databaseId={databaseId}
          formDataSelector={formDataSelector}
          sourceTableId={sourceTableId}
          pageSize={pageSize}
          updateMoreListData={useCallback(setMoreParams, [setMoreParams])}
          isTooMore={data?.isTooMore}
          user={user}
          searchKeyValue={searchKeyValue}
          qs={qs}
          isByCategory={isByCategory}
          isNewQuestion={isNewQuestion}
          setShowNewGuideStart={setShowNewGuideStart}
        />
        <UploadData />
      </>
      <Modal isOpen={confirmModal}>
        <ConfirmContent
          title={t`You have unsaved changes`}
          message={t`Do you want to leave this page and discard your changes?`}
          onClose={() => {
            setConfirmModal(false);
          }}
          onAction={() => {
            setConfirmModal(false);
            const { tableId, tableName, columns } = nextTableObject;
            const filter = getFilter({ tableName, columns });
            replaceUrl({ tableId, filter });
            afterAction();
          }}
        />
      </Modal>

      {showNewGuideStart && (
        <NewGuideStartModal
          onClose={() => {
            setShowNewGuideStart(false);
            nextChartPopoverAction({
              next: "questionSideSearch",
              time: new Date().getTime(),
            });
          }}
          startAction={() => {
            setNewGuideInfo(newGuideHandle(getNewGuideInfo, "table", true));
            setShowNewGuideStart(false);
          }}
        />
      )}
    </Flex>
  );
}

function getDatabaseId(props) {
  const { params, location } = props;
  const dbId =
    parseInt(props.dbId) ||
    parseInt(params.dbId) ||
    parseInt(location.query.dbId) ||
    Urls.extractEntityId(params.slug);
  if (dbId) {
    return Number.isSafeInteger(dbId) ? dbId : undefined;
  }
  if (location.hash) {
    const card = getCard(props);
    return get(card, "dataset_query.database", 3);
  }
}

function getCard(props) {
  const { location } = props;
  if (location.hash) {
    return deserializeCardFromUrl(location.hash);
  }
}

function getIsEditing(props) {
  const card = getCard(props);
  if (get(card, "dataset_query.type") === "native") {
    return false;
  }
  return get(card, "original_card_id");
}

function getFilterTableIds(props) {
  if (!getIsEditing(props)) {
    return [];
  }

  const card = getCard(props);
  const sourceTableId =
    get(card, "dataset_query.query.source-table") ||
    get(card, "dataset_query.query.source-query.source-table");
  const joins = get(card, "dataset_query.query.joins", []);
  return [sourceTableId, ...joins.map(n => n["source-table"])];
}

function mapStateToProps(state, props) {
  return {
    question: getQuestion(state),
    dbId: getDatabaseId(props),
    card: getCard(props),
    metadata: getMetadata(state),
    query: getQuery(state),
    isEditing: getIsEditing(props),
    filterTableIds: getFilterTableIds(props),
    nativeEditorCursorOffset: getNativeEditorCursorOffset(state),
    nativeEditorSelectedText: getNativeEditorSelectedText(state),
    user: getUser(state),
    getNewGuideInfo: getNewGuideInfo(state),
  };
}

export default compose(
  withRouter,
  Database.loadList({
    loadingAndErrorWrapper: false,
    query: () => ({ project: getProject() }),
  }),
  connect(mapStateToProps, {
    replace,
    handleQuestionSideHide: questionSideHideAction,
    closeAllChartPopoverAction,
    setShowPreviewChart,
    setNewGuideInfo,
    nextChartPopoverAction,
  }),
)(QuestionSide);
