/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import hoistNonReactStatic from "hoist-non-react-statics";
import KeepAlive, { useAliveController } from "react-activation";

//https://github.com/CJY0208/react-activation
const KeepAliveControls = name => WrappedComponent => {
  const KeepAliveComponent = props => {
    const { drop } = useAliveController();
    const [initFinish, setInitFinish] = useState(false);
    const { location } = props;
    const { action } = location;

    useEffect(() => {
      const init = async () => {
        if (action === "PUSH" && drop) {
          await drop(name);
        }

        setInitFinish(true);
      };
      init();
    }, [action, drop]);

    const isShow = () => {
      return action === "POP" || initFinish;
    };

    return (
      <div>
        {isShow() && (
          <KeepAlive name={name} when={true} saveScrollPosition={true}>
            <WrappedComponent {...props} />
          </KeepAlive>
        )}
      </div>
    );
  };
  hoistNonReactStatic(KeepAliveComponent, WrappedComponent);
  return KeepAliveComponent;
};

export default KeepAliveControls;
