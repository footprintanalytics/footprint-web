import styled from "styled-components";
import { color } from "metabase/lib/colors";

export const UlStyled = styled.ul.attrs({ className: "pb1" })`
  min-width: 150px;
  overflow-y: auto;
`;

const sectionTitleClassName = "h6 text-uppercase text-bold";

export const SectionTitle = styled.li.attrs({
  className: sectionTitleClassName,
})`
  background-color: #f6f6fe;
  margin: 0;
  padding: 14px 16px;
  color: #313541;
  line-height: 1;
`;

const listItemStyledClassName =
  "px2 cursor-pointer text-white-hover bg-brand-hover hover-parent hover--inherit";

export const ListItemStyled = styled.li.attrs({
  className: listItemStyledClassName,
})`
  padding-top: 5px;
  padding-bottom: 5px;

  .anticon {
    color: #3434b2;
  }

  ${({ isHighlighted }) =>
    isHighlighted &&
    `
      color: ${color("white")};
      background-color: ${color("brand")};

      .anticon {
        color: ${color("white")};
      }
  `})}
`;
