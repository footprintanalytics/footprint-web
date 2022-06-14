/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import { Flex } from "grid-styled";
import { compose } from "underscore";
import "./QueryTemplate.css";
import { databaseTemplate } from "metabase/new-service";
import { loadCard } from "metabase/lib/card";
import { connect } from "react-redux";
import { replace } from "react-router-redux";
import PreviewDashboardCard from "metabase/components/PreviewDashboardCard";
import Icon from "metabase/components/Icon";
import TipActionBar from "metabase/components/TipActionBar";
import { questionSideHideAction } from "metabase/redux/config";
import { unset } from "lodash";
import {
  canAutoShowTemplateChart,
  setNeverShowTemplateChart,
} from "metabase/query_builder/components/QueryTemplateUtil";
import { trackStructEvent } from "metabase/lib/analytics";
import Button from "metabase/components/Button";

function QueryTemplate(props) {
  const {
    databaseId,
    replaceNewQuestion,
    closeAction,
    handleQuestionSideHide,
  } = props;
  const [templateArray, setTemplateArray] = useState();
  const [loadingObject, setLoadingObject] = useState({});
  const showNeverShow = canAutoShowTemplateChart();

  useEffect(() => {
    const loadTemplateList = async ({ databaseId }) => {
      const { list } = await databaseTemplate({ databaseId });
      setTemplateArray(list);
      if (list && list.length > 0) {
        trackStructEvent(`query-template show query template`);
      }
    };
    if (databaseId) {
      loadTemplateList({ databaseId });
    } else {
      setTemplateArray(null);
    }
  }, [databaseId]);

  const replaceTemplateCardUrl = async cardId => {
    setLoadingObject({ cardId, loading: true });
    const card = await loadCard(cardId);
    setLoadingObject({ cardId, loading: false });
    unset(card, ["visualization_settings", "card.title"]);
    replaceNewQuestion(card);
    hideQuestionSide();
  };

  const hideQuestionSide = () => {
    setTimeout(() => {
      handleQuestionSideHide({ hide: true });
    }, 500);
  };

  return (
    <TipActionBar showing={templateArray && templateArray.length > 0}>
      <div className="query-template">
        <div className="query-template__head">
          <span className="query-template__title footprint-primary-text">
            Select a template and modify the filters to quickly create a chart!
          </span>
          <Flex flexDirection="row" alignItems="center">
            {showNeverShow && (
              <Button
                className="query-template__never-show"
                onClick={() => {
                  setNeverShowTemplateChart(true);
                  trackStructEvent(`query-template click never show`);
                  closeAction && closeAction();
                }}
              >
                Never show
              </Button>
            )}
            <div
              className="query-template__close"
              onClick={() => {
                trackStructEvent(`query-template click close`);
                closeAction && closeAction();
              }}
            >
              <Icon name="close" color={"white"} size={16} />
            </div>
          </Flex>
        </div>
        <Flex className="full-height overflow-auto" flexDirection="row">
          {templateArray &&
            templateArray.map(chart => {
              return (
                <div
                  key={chart.id}
                  className="query-template__item"
                  onClick={() => {
                    trackStructEvent(`query-template click chart`);
                    replaceTemplateCardUrl(chart.id);
                  }}
                >
                  <PreviewDashboardCard
                    item={chart}
                    loading={
                      chart.id === loadingObject.cardId && loadingObject.loading
                    }
                    onlyShowTitle
                    disableLinkClick
                  />
                </div>
              );
            })}
        </Flex>
      </div>
    </TipActionBar>
  );
}

const mapStateToProps = state => {
  return {
    user: state.currentUser,
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, {
    replace,
    handleQuestionSideHide: questionSideHideAction,
  }),
)(QueryTemplate);
