import styled from "styled-components";
import PropTypes from "prop-types";
import Button from "metabase/components/Button";
import { color } from "metabase/lib/colors";

const FONT_SIZE_VARIANTS = {
  small: "12px",
  medium: "1em",
};

export const TextButton = styled(Button)`
  color: ${color("text-medium")};
  font-size: ${props =>
    FONT_SIZE_VARIANTS[props.size] || FONT_SIZE_VARIANTS.medium};
  border: none;
  padding: 0;
  background-color: transparent;
`;

TextButton.propTypes = {
  size: PropTypes.oneOf(["small", "medium"]),
};
