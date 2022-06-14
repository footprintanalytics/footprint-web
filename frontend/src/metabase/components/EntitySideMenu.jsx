import React, { Component } from "react";
import { Motion, spring } from "react-motion";
import cx from "classnames";

import { Flex } from "grid-styled";
import Popover from "metabase/components/Popover";
import SideMenu from "metabase/components/SideMenu";
import LogoIcon from "metabase/components/LogoIcon";
import Link from "metabase/components/Link";

class EntitySideMenu extends Component {
  state = {
    open: false,
  };

  // toggleMenu = () => {
  //   const open = !this.state.open;
  //   this.setState({ open });
  // };

  render() {
    const { open } = this.state;
    return (
      <div className={cx("relative")}>
        <Link to="/">
          <Flex
            style={{ minWidth: 161, height: 32 }}
            align="center"
            justify="center"
          >
            <LogoIcon dark height={32} />
          </Flex>
        </Link>

        <Popover
          sizeToFit={true}
          isOpen={open}
          onClose={this.toggleMenu}
          hasArrow={false}
          hasBackground={false}
          horizontalAttachments={["left", "right"]}
          zIndexTop={5}
          targetOffsetY={-2}
          style={{
            background: "#fff",
            height: "100vh",
            overflow: "hidden",
            width: "260px",
          }}
        >
          <Motion
            defaultStyle={{
              opacity: 0,
              translateY: 0,
            }}
            style={{
              opacity: open ? spring(1) : spring(0),
              translateY: open ? spring(10) : spring(0),
            }}
          >
            {({ opacity, translateY }) => (
              <div
                style={{
                  opacity: opacity,
                  transform: `translateY(${translateY}px)`,
                  height: "100%",
                }}
              >
                <SideMenu onClose={this.toggleMenu} {...this.props} />
              </div>
            )}
          </Motion>
        </Popover>
      </div>
    );
  }
}

export default EntitySideMenu;
