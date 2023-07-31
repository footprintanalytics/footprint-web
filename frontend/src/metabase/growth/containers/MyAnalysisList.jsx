/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { Alert, message, Modal, Button } from "antd";
import List from "metabase/containers/creator/components/personal/list";
import { getUser } from "metabase/selectors/user";
import {
  createModalShowAction,
  loginModalShowAction,
} from "metabase/redux/control";

const MyAnalysisList = props => {
  const { router, location, children, user, project, setCreateModalShow ,setLoginModalShow, showTabs, defaultModel} =
    props;
  router.params.name = user?.name;
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();
  return (
    <div className="flex flex-column items-center justify-center w-full">
      {contextHolder}
      {modalContextHolder}
      {user ? (
        <div
          className="my__analysis"
          style={{ width: "100%", padding: "0px 20px" }}
        >
          <List
            router={router}
            user={user}
            name={user?.name}
            location={router.location}
            showTabs={showTabs}
            defaultModel={defaultModel}
          />
        </div>
      ) : (
        <div style={{ width: "100%", maxWidth: 600, margin: 20 }}>
          <Alert
            message={<Button type="primary" onClick={()=>{
              setLoginModalShow({ show: true, from: "my_analysis" });
            }}>Sign in</Button>}
            description="Please sign in to view your analysis."
            type="warning"
            showIcon
          />
        </div>
      )}
    </div>
  );
};

const mapDispatchToProps = {
  setCreateModalShow: createModalShowAction,
  setLoginModalShow: loginModalShowAction,
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyAnalysisList);
