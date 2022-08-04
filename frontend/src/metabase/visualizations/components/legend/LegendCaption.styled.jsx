import styled from "styled-components";
import colors from "metabase/lib/colors";
import Icon from "metabase/components/Icon";

export const LegendCaptionRoot = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  max-width: 80%;
`;

export const LegendLabel = styled.div`
  color: ${colors["text-legend-title"]};
  font-size: 18px;
  font-weight: normal;
  cursor: ${({ onClick }) => (onClick ? "pointer" : "")};
  overflow: hidden;

  &:hover {
    color: ${({ onClick }) => (onClick ? colors["brand"] : "")};
  }
`;

export const LegendLabelIcon = styled(Icon)`
  padding-right: 0.25rem;
`;

export const LegendDescriptionIcon = styled(Icon).attrs({
  name: "info",
})`
  color: ${colors["text-medium"]};
  margin-left: 0.5rem;
`;
