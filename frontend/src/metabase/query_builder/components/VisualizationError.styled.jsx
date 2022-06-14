import styled from "styled-components";
import { color } from "metabase/lib/colors";
import { space } from "metabase/styled-components/theme";

export const QueryError = styled.div`
  display: flex;
  overflow: auto;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const QueryErrorIcon = styled.div`
  height: 70px;
  width: 70px;
  color: ${color("error")};
  padding: ${space(2)};
  margin-bottom: ${space(1)};
  border: 0.25rem solid ${color("accent3")};
  border-radius: 50%;
`;

export const QueryErrorMessage = styled.div`
  color: ${color("error")};
  max-width: 31.25rem;
  min-height: 0;
`;
