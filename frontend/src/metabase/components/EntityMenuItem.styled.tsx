import styled from "@emotion/styled";
import { Link } from "react-router";
import { color } from "metabase/lib/colors";
import ExternalLink from "metabase/core/components/ExternalLink";
import Icon from "metabase/components/Icon";

export interface MenuItemProps {
  disabled?: boolean;
}

export const MenuItemContent = styled.div<MenuItemProps>`
  display: flex;
  align-items: center;
  border-radius: 0.5em;
  cursor: ${props => (props.disabled ? "not-allowed" : "pointer")};
  color: ${props => color(props.disabled ? "text-light" : "text-dark")};
  padding: 10px 20px;
  text-decoration: none;
  :hover {
    color: ${props => !props.disabled && color("brand")};
    background-color: ${props => !props.disabled && color("bg-light")};
  }
  > .Icon {
    color: ${props => color(props.disabled ? "text-light" : "text-dark")};
    margin-right: 0.65em;
  }
  :hover > .Icon {
    color: ${props => !props.disabled && color("brand")};
  },
  /* icon specific tweaks
     the alert icon should be optically aligned  with the x-height of the text */
  > .Icon.Icon-alert {
    transform: translate-y(1px),
}
  /* the embed icon should be optically aligned with the x-height of the text */
  > .Icon.Icon-embed {
    transform: translate-y(1px);
  }
  /* the download icon should be optically aligned with the x-height of the text */
  > .Icon.Icon-download: {
    transform: translate-y(1px);
  }
  /* the history icon is wider so it needs adjustment to center it with other
   icons */
  "> .Icon.Icon-history": {
    transform: translate-x(-2px);
  },
`;

export const MenuItemIcon = styled(Icon)`
  margin-right: 0.5rem;
`;

export const MenuItemRightContainer = styled.span`
  display: flex;
  flex-direction: column;
  line-height: 20px;
`;

export const MenuItemTitle = styled.span`
  font-weight: bold;
  color: ${color("footprint-color-title")};
  line-height: 20px;
`;

export const MenuItemDesc = styled.span`
  font-weight: normal;
  font-size: 12px;
  color: ${color("footprint-color-secondary-text2")};
  max-width: 260px;
  line-height: 16px;
  margin-top: 4px;
`;

export const MenuLink = styled(Link)`
  display: block;
`;

export const MenuExternalLink = styled(ExternalLink)`
  text-decoration: none;
  display: block;
`;
