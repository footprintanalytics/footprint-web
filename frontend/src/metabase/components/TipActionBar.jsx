/* eslint-disable react/prop-types */
import React from "react";
import styled from "styled-components";
import { Box } from "grid-styled";
import { Motion, spring } from "react-motion";

const FixedBottomBar = styled(Box)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
`;

const TipActionBar = ({ children, showing }) => (
  <Motion
    defaultStyle={{
      opacity: 0,
      translateY: 100,
    }}
    style={{
      opacity: showing ? spring(1) : spring(0),
      translateY: showing ? spring(0) : spring(100),
    }}
  >
    {({ opacity, translateY }) => (
      <FixedBottomBar
        style={{
          borderRadius: 0,
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
        data-testid="tip-action-bar"
      >
        {children}
      </FixedBottomBar>
    )}
  </Motion>
);

export default TipActionBar;
