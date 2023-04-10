import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { color } from "metabase/lib/colors";

export interface DashCardRootProps {
  isNightMode: boolean;
  isUsuallySlow: boolean;
}

export const DashCardRoot = styled.div<DashCardRootProps>`
  border: 1px solid ${color("border")};

  ${({ isNightMode }) =>
    isNightMode &&
    css`
      border: 0;
      background-color: ${color("bg-night")};
    `}

  ${({ isUsuallySlow }) =>
    isUsuallySlow &&
    css`
      border-color: ${color("accent4")};
    `}
`;
