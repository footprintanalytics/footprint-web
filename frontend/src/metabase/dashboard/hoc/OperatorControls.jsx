/* eslint-disable react/prop-types */
import React, { Component } from "react";
import OperateHelper from "metabase/dashboard/OperateHelper";
import connect from "react-redux/lib/connect/connect";
import { cancelFeedbackAction } from "metabase/redux/control";
import { getCurrentUser } from "metabase/admin/datamodel/selectors";
import userCancelFeedbackUtil from "metabase/dashboard/components/utils/userCancelFeedbackUtil";

const createComponent = (ComposedOperatorComponent, type) =>
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(
    class extends Component {
      static displayName = "";

      UNSAFE_componentWillMount() {
        const { user } = this.props;
        if (user) {
          this.registerFeedBack();
        }
      }

      UNSAFE_componentWillReceiveProps(nextProps) {
        const { user } = nextProps;
        if (!this.props.user && user) {
          this.registerFeedBack();
        }
      }

      registerFeedBack() {
        const { cancelFeedbackAction } = this.props;
        setTimeout(
          () =>
            OperateHelper.register(() => {
              if (userCancelFeedbackUtil.canBlock("view")) {
                cancelFeedbackAction({
                  show: true,
                  type: "view",
                  scene: `view-${type}-no-operation`,
                });
              }
            }, 5 * 60 * 1000),
          100,
        );
      }

      componentWillUnmount() {
        const { user } = this.props;
        if (user) {
          OperateHelper.unRegister();
        }
      }

      render() {
        return <ComposedOperatorComponent {...this.props} />;
      }
    },
  );

const mapStateToProps = (state, props) => ({
  user: getCurrentUser(state, props),
});

const mapDispatchToProps = {
  cancelFeedbackAction,
};

export default type => (ComposedOperatorComponent: React.Class) =>
  createComponent(ComposedOperatorComponent, type);
