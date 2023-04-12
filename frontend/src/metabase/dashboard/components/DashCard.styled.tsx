import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { color } from "metabase/lib/colors";

export interface DashCardRootProps {
  isNightMode: boolean;
  isUsuallySlow: boolean;
}

export const DashCardRoot = styled.div<DashCardRootProps>`
  border: 1px solid ${color("border")};
  background-color: ${props => props.isNightMode ? color("--color-bg-card-dark") : color("white")};

  ${({ isNightMode }) =>
    isNightMode &&
    css`
      border: 0;
    `}

  ${({ isUsuallySlow }) =>
    isUsuallySlow &&
    css`
      border-color: ${color("accent4")};
    `}
`;
