import styled from "styled-components";
import colors from "metabase/lib/colors";
import Icon from "metabase/components/Icon";

export const LegendItemRoot = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  overflow: hidden;
  margin-right: ${({ isVertical }) => (isVertical ? "" : "8px")};

  &:not(:first-child) {
    margin-top: ${({ isVertical }) => (isVertical ? "0.5rem" : "")};
  }
`;

export const LegendItemLabel = styled.div`
  display: flex;
  align-items: baseline;
  opacity: ${({ isMuted }) => (isMuted ? "0.4" : "1")};
  cursor: ${({ onClick }) => (onClick ? "pointer" : "")};
  overflow: hidden;
  transition: opacity 0.25s linear;
  font-size: 12px;

  &:hover {
    color: ${({ onMouseEnter }) => (onMouseEnter ? colors["brand"] : "")};
  }
`;

export const LegendItemDot = styled.div`
  /*flex: 0 0 auto;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background-color: ${({ color }) => color};*/
`;

export const LegendItemTitle = styled.div`
  color: ${colors["text-legend"]};
  font-weight: normal;
  overflow: hidden;
`;

export const LegendItemRemoveIcon = styled(Icon).attrs({
  name: "close",
  size: 12,
})`
  color: ${colors["text-light"]};
  cursor: pointer;
  margin-left: 0.5rem;

  &:hover {
    color: ${colors["text-medium"]};
  }
`;
