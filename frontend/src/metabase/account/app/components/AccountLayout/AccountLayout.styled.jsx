import styled from "@emotion/styled";
import { breakpointMinSmall, space } from "metabase/styled-components/theme";

export const AccountContent = styled.div`
  margin: 0 auto;
  padding: ${space(2)} 0;

  ${breakpointMinSmall} {
    width: 640px;
    // padding: ${space(3)} ${space(2)};
  }
`;
