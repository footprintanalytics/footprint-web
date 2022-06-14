/* eslint-disable react/prop-types */
import React from "react";

import { Flex } from "grid-styled";

import AuthSlider from "../components/AuthSlider";

const AuthLayout = ({ children }) => (
  <Flex flexDirection="row" flex={1} className="overflow-hidden relative">
    <Flex
      mt={-4}
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      flex={2}
    >
      <Flex className="relative z2" style={{ width: 580 }}>
        {children}
      </Flex>
    </Flex>
    <Flex flex="3" style={{ minWidth: 0, maxWidth: 2000 }}>
      <AuthSlider />
    </Flex>
    {/*<AuthScene />*/}
  </Flex>
);

export default AuthLayout;
