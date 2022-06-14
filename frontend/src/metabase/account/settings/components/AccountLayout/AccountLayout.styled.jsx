import styled from "styled-components";
import { breakpointMinSmall, space } from "metabase/styled-components/theme";

export const AccountContent = styled.div`
  margin: 0 auto;
  padding: 20px 0 40px 0;

  ${breakpointMinSmall} {
    /* width: 540px; */
    width: 640px;
    /* padding: ${space(3)} ${space(2)}; */
  }
`;
