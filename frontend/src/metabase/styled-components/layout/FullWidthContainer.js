import styled from "styled-components";
import {
  breakpointMinSmall,
  breakpointMinMedium,
} from "metabase/styled-components/theme";

export const FullWidthContainer = styled.div`
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;

  ${breakpointMinSmall} {
    padding-left: 20px;
    padding-right: 20px;
  }

  ${breakpointMinMedium} {
    padding-left: 20px;
    padding-right: 20px;
  }
`;
