/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { message } from "antd";
import { saveAs } from "file-saver";
import "./index.css";
import array from "metabase/containers/market/picture/data/data";
import { getUser } from "metabase/selectors/user";
import connect from "react-redux/lib/connect/connect";

const Market = props => {
  const { user } = props;
  const [picData, setPicData] = useState();
  const [title, setTitle] = useState();

  if (user && !user.isMarket) {
    return (
      <div className="market__nodata">
        No content displayed, please contact the administrator
      </div>
    );
  }

  return (
    <div className="market">
      <div className="market__list">
        {array.map(item => {
          return (
            <div key={item.title} className="market__item">
              <div
                className="market__create"
                onClick={async () => {
                  const hide = message.loading("Loading...", 0);
                  setPicData(undefined);
                  setTitle(undefined);

                  try {
                    const data = await item.parseData(item.api);
                    const picBase64 = await item.draw(data, item.title);
                    setPicData(picBase64);
                    setTitle(item.title);
                  } catch (e) {
                    console.log(e);
                  } finally {
                    hide();
                  }
                }}
              >
                {item.title}
              </div>
            </div>
          );
        })}
      </div>

      <div className="market__display">
        <img src={picData} alt="preview" />
      </div>

      <div
        className="market__download"
        onClick={async () => {
          if (!picData) {
            message.success("Create image first");
            return;
          }
          const hide = message.loading("Loading...", 0);
          await saveAs(picData, `${title}.png`);
          hide();
        }}
      >
        download
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  user: getUser(state),
});

export default connect(mapStateToProps)(Market);
