import styled from "@emotion/styled";
import {
  breakpointMinSmall,
  breakpointMinMedium,
} from "metabase/styled-components/theme";

export const FullWidthContainer = styled.div`
  margin: 0 auto;
  padding: 0 1em;
  width: 100%;

  ${breakpointMinSmall} {
    padding-left: 15px;
    padding-right: 15px;
  }

  ${breakpointMinMedium} {
    padding-left: 20px;
    padding-right: 20px;
  }
`;
