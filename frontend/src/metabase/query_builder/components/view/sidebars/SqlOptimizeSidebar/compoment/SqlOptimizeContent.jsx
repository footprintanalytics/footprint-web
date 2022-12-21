/* eslint-disable react/prop-types */
import React from "react";
import Link from "metabase/core/components/Link";
import "./SqlOptimizeContent.css";
import getSqlOptimize from "metabase/query_builder/components/view/sidebars/SqlOptimizeSidebar/helper";

const SqlOptimizeContent = ({
  sql
}) => {

  const tips = getSqlOptimize(sql);
  const hasTips = tips && tips?.length > 0;

  return (
    <div className="sql-tip__inner">
      <div className="sql-tip__inner-top">
        <div className="sql-tip__inner-total">
          {hasTips ? `Total ${tips?.length || 0} tips.` : "No tips."}
        </div>
      </div>
      {hasTips && (
        <>
          <div className="sql-tip__division"/>
          <div className="sql-tip__content">
            <ul>
              {tips.map((item, index) => {
                return (
                  <li key={index}>
                    <h4>{`Tip ${index + 1}: `}</h4>
                    {item.result}
                  </li>
                )
              })}
            </ul>
          </div>
        </>
      )}
      <div className="sql-tip__inner-bottom">
        You can find more SQL Best Practices in this <Link className="underline text-underline text-underline-hover" to="https://docs.footprint.network/docs/sql">docs</Link>.
      </div>
    </div>
  );
};


export default React.memo(SqlOptimizeContent);
