/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
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
import TableSelect from "metabase/query_builder/components/question/TableSelect";
import demoData from "metabase/query_builder/components/question/data";
import TableCategory2 from "metabase/query_builder/components/question/TableCategory2";
import Icon from "metabase/components/Icon";

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
  const [status, setStatus] = useState(0);
  const [databaseId, setDatabaseId] = useState(dbId || 3);
  const [category, setCategory] = useState();
  const [s1, setS1] = useState("");
  const [s2, setS2] = useState("");
  const [moreParams, setMoreParams] = useState();
  const [searchKey, setSearchKey] = useState("");
  // const [dataSets, setDatasets] = useState([]);
  const [nextTableId, setNextTableId] = useState();
  const [confirmModal, setConfirmModal] = useState(false);
  const [showNewGuideStart, setShowNewGuideStart] = useState(false);
  const isNative = query instanceof NativeQuery;
  const sourceTableId = get(card, "dataset_query.query.source-table");
  const pageSize = 10;
  const canShowNewGuide = canShowNewGuideStart(user);
  const newGuideShowTable = getNewGuideInfo && getNewGuideInfo["table"];
  const queryType = get(card, "dataset_query.type");
  const isNewQuestion = !get(question, "_card.original_card_id");
  const searchKeyValue = searchKey?.trim()?.toLowerCase() || "";

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

  const dataSets = updateMoreListData(
    data?.list && handleTableListDataFunction(data?.list),
    moreParams,
  );

  useEffect(() => {
    if (newGuideShowTable && dataSets?.length > 0) {
      newGuideHighlight({ key: "table", getNewGuideInfo, setNewGuideInfo });
    }
  }, [newGuideShowTable, dataSets, getNewGuideInfo, setNewGuideInfo]);

  const replaceUrl = ({ tableId, type = "query" }) => {
    replace(Urls.newQuestion({ databaseId, tableId, type }));
  };

  const handleSelectTable = async ({ tableId, tableName, columnName }) => {
    closeNewGuide({ key: "table" });
    if (selectTableAction) {
      selectTableAction({ tableId, tableName, columnName });
      return;
    }
    if (isEditing) {
      return;
    }
    setNextTableId(tableId);
    if (isNative) {
      updateNativeEditorSelect({
        databaseId,
        tableName,
        columnName,
        query,
        question,
        nativeEditorCursorOffset,
        nativeEditorSelectedText,
        databaseName: databases.find(f => f.id === databaseId)?.name || "",
      });
      return;
    }
    if (!isInitHash({ sourceTableId, databaseId })) {
      setConfirmModal(true);
      return;
    }

    replaceUrl({ tableId });
    afterAction();
  };

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
    if (value) {
      setStatus(1);
    }
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
      {status === 0 && (
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
      )}
      {status === 1 && (
        <div className="flex">
          <TableSelect
            list={demoData().d1}
            placeholder={"Chains"}
            onSelect={value => {
              setS1(value);
              setSearchKey(`${value} ${s2}`);
            }}
          />
          {/*<TableSelect list={demoData().d2} placeholder={"Protocol"}/>*/}
          <TableSelect
            placeholder={"Metrics"}
            dataSets={dataSets}
            category={category}
            searchKeyValue={searchKeyValue}
            onSelect={value => {
              setS2(value);
              setSearchKey(`${s1} ${value}`);
            }}
          />
        </div>
      )}
      {status === 1 && category && (
        <div className="flex">
          <div
            onClick={() => {
              setCategory(null);
              setStatus(0);
              setSearchKey("");
            }}
          >
            <Icon name="back2" size={14} />
          </div>
          <div className={"ml1 footprint-primary-text"}>{category}</div>
        </div>
      )}
      {!formDataSelector && status === 0 && (
        <TableCategory2
          databaseId={databaseId}
          categoryChange={categoryChange}
          category={category}
        />
      )}
      {status === 1 && (
        <>
          <TableDataList
            isLoading={isLoading}
            isFeature={data?.isFeature}
            dataSets={
              canShowNewGuide ? handleNewGuideTableData(dataSets) : dataSets
            }
            isEditing={isEditing}
            handleSelectTable={handleSelectTable}
            setShowPreviewChart={setShowPreviewChart}
            closeTemplateData={closeTemplateData}
            databaseId={databaseId}
            databases={databases}
            formDataSelector={formDataSelector}
            sourceTableId={sourceTableId}
            pageSize={pageSize}
            updateMoreListData={params => setMoreParams(params)}
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
      )}
      <Modal isOpen={confirmModal}>
        <ConfirmContent
          title={t`You have unsaved changes`}
          message={t`Do you want to leave this page and discard your changes?`}
          onClose={() => {
            setConfirmModal(false);
          }}
          onAction={() => {
            setConfirmModal(false);
            replaceUrl({ tableId: nextTableId });
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
