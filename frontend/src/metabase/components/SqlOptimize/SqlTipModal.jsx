/* eslint-disable react/prop-types */
import React from "react";
import { withRouter } from "react-router";
import ModalContent from "metabase/components/ModalContent";
import Modal from "metabase/components/Modal";
import Link from "metabase/core/components/Link";
import "./SqlTipModel.css";

const SqlTipModel = props => {
  const { onClose, tips } = props;
  console.log("tips", tips)

  return (
    <Modal small className="w-auto" ModalClass="z-index-top" onClose={onClose}>
      <ModalContent onClose={onClose}>
        <div className="sql-tip__inner">
          <h3>How to query faster?</h3>
          <div className="sql-tip__content">
            {
              tips && (
                <ul>
                  {tips.map((item, index) => {
                    return (
                      <li key={index}>
                        {`Tip ${index + 1}: ${item.result}`}
                      </li>
                    )
                  })}
                </ul>
              )
            }
            {!tips && <span>No SQL optimize. Your SQL looks very good.</span>}
          </div>
          <div className="sql-tip__inner-bottom">We can also find SQL Best Practices on this in the <Link className="underline text-underline text-underline-hover" to="https://docs.footprint.network/docs/sql">docs</Link>.</div>
        </div>
      </ModalContent>
    </Modal>
  );
}

export default withRouter(SqlTipModel);
