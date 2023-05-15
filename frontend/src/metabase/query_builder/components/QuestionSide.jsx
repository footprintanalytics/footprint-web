/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useMemo, useState, memo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { replace } from "react-router-redux";
import { get, words } from "lodash";
import { useQuery } from "react-query";
import { Tabs } from "antd";
import { t } from "ttag";
import { compose } from "underscore";
import Database from "metabase/entities/databases";
import "./QuestionSide.css";
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
import Link from "metabase/core/components/Link";
// eslint-disable-next-line import/order
import { UploadOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { getUser } from "metabase/selectors/user";
import {
  // canShowNewGuideStart,
  closeNewGuide,
  newGuideHandle,
  newGuideHighlight,
} from "metabase/containers/newguide/newGuide";
import { getNewGuideInfo } from "metabase/selectors/control";
import TableSearch from "metabase/query_builder/components/question/TableSearch";
import NewGuideStartModal from "metabase/containers/newguide/NewGuideStartModal";
import { QUERY_OPTIONS_NORMAL } from "metabase/containers/dashboards/shared/config";
import { tableSearchV2 } from "metabase/new-service";
import { getProject } from "metabase/lib/project_info";
import { getMetadata } from "metabase/selectors/metadata";
import * as Urls from "metabase/lib/urls";
import dateFieldMapping from "metabase/query_builder/data/data";
import TableChains from "metabase/query_builder/components/question/TableChains";
import { isChartPage } from "metabase/lib/urls";
import QuestionSideTab from "metabase/query_builder/components/QuestionSideTab";
import NativeQuery from "metabase-lib/queries/NativeQuery";
import {
  getNativeEditorCursorOffset,
  getNativeEditorSelectedText,
  getQuery,
  getQuestion,
} from "../selectors";

function QuestionSide({
  question,
  query,
  card,
  databases,
  dbId,
  replace,
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
  updateQuestion,
}) {
  const [databaseId, setDatabaseId] = useState(dbId || 3);
  const [columnDataMap, setColumnDataMap] = useState({});
  const [handleSelectTable, setHandleSelectTable] = useState();
  const [chain, setChain] = useState("all");
  const [level, setLevel] = useState("all");
  const [searchKey, setSearchKey] = useState("");
  // const [dataSets, setDatasets] = useState([]);
  const [nextTableObject, setNextTableObject] = useState({});
  const [confirmModal, setConfirmModal] = useState(false);
  const [showNewGuideStart, setShowNewGuideStart] = useState(false);
  const isNative = query instanceof NativeQuery;
  const sourceTableId = get(card, "dataset_query.query.source-table");
  const pageSize = 10;
  const canShowNewGuide = false;
  // const canShowNewGuide = canShowNewGuideStart(user);
  const newGuideShowTable = getNewGuideInfo && getNewGuideInfo["table"];
  const queryType = get(card, "dataset_query.type");
  const isNewQuestion = !get(question, "_card.original_card_id");
  const searchKeyValue = searchKey.trim().toLowerCase();

  const databaseName = useMemo(() => {
    return databases?.find(f => f.id === databaseId)?.name || "";
  }, [databaseId, databases]);

  const qString = words(searchKeyValue, /[^ ]+/g)
    .map(s => s.trim())
    .filter(s => s !== "");
  const isTabCommunity = level === "community";

  const qs = qString.length > 0 ? qString : null;
  const levelObject = isTabCommunity ? {} : { level: level };

  const params = {
    databaseId,
    qs,
    project: getProject(),
    queryType: queryType,
    ...levelObject,
    isCommunity: isTabCommunity,
    filterChain: chain === "all" || isTabCommunity || !chain ? null : [chain],
  };

  const { isLoading, data } = useQuery(
    ["tableSearchV2", params],
    async () => {
      return await tableSearchV2(params);
    },
    QUERY_OPTIONS_NORMAL,
  );

  const isByCategory = data?.isByCategory; //

  const handleTableListDataFunction = isByCategory
    ? handleTableListDataByCategory
    : handleTableListData;

  const updateColumnsData = (dataSets, columnDataMap) => {
    if (Object.keys(columnDataMap).length === 0) {
      return dataSets;
    }
    return dataSets?.map(dataSet => {
      if (isByCategory) {
        return {
          ...dataSet,
          columns: columnDataMap[dataSet.id],
        }
      }
      return {
        ...dataSet,
        tables: dataSet.tables.map(table => {
          return {
            ...table,
            columns: columnDataMap[table.id],
          }
        })
      };
    });
  };

  const dataSets = useMemo(
    () =>
      updateColumnsData(
        data?.list && handleTableListDataFunction(data?.list),
        columnDataMap,
      ),
    [data?.list, handleTableListDataFunction, columnDataMap],
  );
  useEffect(() => {
    if (newGuideShowTable && dataSets?.length > 0) {
      newGuideHighlight({ key: "table", getNewGuideInfo, setNewGuideInfo });
    }
  }, [newGuideShowTable, dataSets, getNewGuideInfo, setNewGuideInfo]);

  const getFilter = ({ tableName, columns }) => {
    let filter = null;
    const mapping = dateFieldMapping.mapping.find(
      mapping => mapping.tableName === tableName,
    ) || dateFieldMapping.dateFieldSuffix.find(suffixObject => tableName.endsWith(suffixObject.tableName));
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
      Urls.newQuestion({ databaseId, tableId, type, filter, limit: 1000 }),
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
          updateQuestion,
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

  const SubmitContract = () => {
    if (formDataSelector) {
      return null;
    }

    return (
      <Link to="/submit/contract" className="question-side__custom-upload">
        <PlusCircleOutlined />
        Submit contract
      </Link>
    );
  };

  const chainChange = value => {
    setChain(value);
  };

  return (
    <div
      className="flex flex-column full-height overflow-auto relative"
    >
      {!formDataSelector && (
        <TableDatabase
          setDatabaseId={setDatabaseId}
          isNative={isNative}
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
        <TableChains
          disabled={isTabCommunity}
          chainChange={chainChange}
          chain={chain}
        />
      )}
      <QuestionSideTab
        setColumnDataMap={setColumnDataMap}
        level={level}
        setLevel={setLevel}
        isLoading={isLoading}
        isFeature={data?.isFeature}
        dataSets={
          canShowNewGuide
            ? handleNewGuideTableData(dataSets)
            : dataSets
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
        databaseName={databaseName}
        formDataSelector={formDataSelector}
        sourceTableId={sourceTableId}
        pageSize={pageSize}
        isTooMore={data?.isTooMore}
        user={user}
        searchKeyValue={searchKeyValue}
        qs={qs}
        isByCategory={isByCategory}
        isNewQuestion={isNewQuestion}
        setShowNewGuideStart={setShowNewGuideStart}
      />

      <div style={{ margin: "10px 15px" }}>
        <SubmitContract />
        <UploadData />
      </div>
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
    </div>
  );
}

function getDatabaseId(props) {
  const { params, location } = props;
  const dbId =
    parseInt(props.dbId) ||
    parseInt(params.dbId) ||
    parseInt(location.query.dbId) ||
    (!isChartPage() && Urls.extractEntityId(params.slug));

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

/*function getFilterTableIds(props) {
  if (!getIsEditing(props)) {
    return [];
  }

  const card = getCard(props);
  const sourceTableId =
    get(card, "dataset_query.query.source-table") ||
    get(card, "dataset_query.query.source-query.source-table");
  const joins = get(card, "dataset_query.query.joins", []);
  return [sourceTableId, ...joins.map(n => n["source-table"])];
}*/

function mapStateToProps(state, props) {
  return {
    question: getQuestion(state),
    // filterTableIds: getFilterTableIds(props),
    card: getCard(props),
    query: getQuery(state),
    dbId: getDatabaseId(props),
    metadata: getMetadata(state),
    isEditing: getIsEditing(props),
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
)(memo(QuestionSide));
