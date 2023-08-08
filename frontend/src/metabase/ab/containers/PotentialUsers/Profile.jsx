/* eslint-disable react/prop-types */
import React from "react";
import "../../css/index.css";
import "./index.css";
import cx from "classnames";
import Visualization from "metabase/visualizations/components/Visualization";
import QuestionResultLoader from "metabase/containers/QuestionResultLoader";
import Question from "metabase-lib/Question";

const Profile = props => {
  const { sql, title } = props;
  const question = Question.create({
    dataset_query: {
      database: 3,
      type: "native",
      native: {
        query: "",
        "template-tags": {},
      },
    },
    display: "pie",
    visualization_settings: {
      "graph.y_axis.auto_split": false,
      "pie.show_center_value": false,
      "pie.show_data_labels": false,
      "pie.show_legend": true,
      "pie.show_legend_perecent": true,
      "rose.data": "wallets",
    },
  }).query()
    .setQueryText(sql)
    .question()
  return (
    <div className="Potential-Users__profile">
      {title && <span>{title}</span>}
      <QuestionResultLoader question={question} isPreview={false}>
        {({ rawSeries, result }) => {
          return (
            <Visualization
              rawSeries={rawSeries}
              error={result && result.error}
              className={cx("bordered shadowed rounded bg-white", {
                p2: result && result.error,
              })}
            />
          );
        }}
      </QuestionResultLoader>
    </div>
  );
};

export default Profile;
