/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { message, Modal } from "antd";
import List from "metabase/containers/creator/components/personal/list";
import { getUser } from "metabase/selectors/user";
import { createModalShowAction } from "metabase/redux/control";

const MyAnalysisList = props => {
  const { router, location, children, user, project, setCreateModalShow } =
    props;
  router.params.name = user?.name;
  const [messageApi, contextHolder] = message.useMessage();

  const [modal, modalContextHolder] = Modal.useModal();
  return (
    <div className="flex flex-column items-center justify-center w-full">
      {contextHolder}
      {modalContextHolder}
      <div style={{ width: "100%" }}>
        <List
          router={router}
          user={user}
          name={user?.name}
          location={router.location}
        />
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  setCreateModalShow: createModalShowAction,
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyAnalysisList);
