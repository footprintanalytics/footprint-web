import React from "react";
import PropTypes from "prop-types";

import Sidebar from "metabase/dashboard/components/Sidebar";
import QuestionPickerNew from "./QuestionPickerNew";

AddCardSidebar.propTypes = {
  onSelect: PropTypes.func.isRequired,
  initialCollection: PropTypes.number,
};

export function AddCardSidebar(props) {
  return (
    <Sidebar>
      <QuestionPickerNew {...props} />
    </Sidebar>
  );
}
