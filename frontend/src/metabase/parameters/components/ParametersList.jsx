/* eslint-disable react/prop-types */
import React, { useState } from "react";
import cx from "classnames";

import Icon from "metabase/components/Icon";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "metabase/components/sortable";
import { getVisibleParameters } from "metabase/parameters/utils/ui";
import StaticParameterWidget from "./ParameterWidget";
import StaticParameterWidgetFga from "./ParameterWidgetFga";
import Button from "metabase/core/components/Button";

const StaticParameterWidgetList = ({
  children,
  onSortStart,
  onSortEnd,
  ...props
}) => {
  return <div {...props}>{children}</div>;
};

const SortableParameterHandle = SortableHandle(() => (
  <div className="flex layout-centered cursor-grab text-inherit">
    <Icon name="grabber2" size={12} />
  </div>
));

const SortableParameterWidget = SortableElement(StaticParameterWidget);
const SortableParameterWidgetList = SortableContainer(
  StaticParameterWidgetList,
);

function ParametersList({
  className,

  parameters,
  dashboard,
  editingParameter,

  isFullscreen,
  isNightMode,
  hideParameters,
  isEditing,
  vertical,
  commitImmediately,

  setParameterValue,
  setParameterIndex,
  removeParameter,
  setEditingParameter,
}) {
  const [showNormalVisibleParams, setShowNormalVisibleParams] = useState(false)

  const handleSortStart = () => {
    document.body.classList.add("grabbing");
  };

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    document.body.classList.remove("grabbing");
    if (setParameterIndex) {
      setParameterIndex(parameters[oldIndex].id, newIndex);
    }
  };

  const visibleValuePopulatedParameters = getVisibleParameters(
    parameters,
    hideParameters,
  );

  let ParameterWidget;
  let ParameterWidgetList;
  if (isEditing) {
    ParameterWidget = SortableParameterWidget;
    ParameterWidgetList = SortableParameterWidgetList;
  } else {
    ParameterWidget = StaticParameterWidget;
    ParameterWidgetList = StaticParameterWidgetList;
  }

  const fgaVisibleValuePopulatedParameters = visibleValuePopulatedParameters
    ?.filter(item => item.sectionId === "fp_enum");
  const normalVisibleValuePopulatedParameters = visibleValuePopulatedParameters
    ?.filter(item => item.sectionId !== "fp_enum");

  const showAdvanced = fgaVisibleValuePopulatedParameters.length > 0 && !isEditing;

  return visibleValuePopulatedParameters.length > 0 ? (
    <div className="flex flex-column w-full">
      <div className="flex flex-row justify-between">
      <ParameterWidgetList
        className={cx(
          className,
          "flex flex-wrap",
          "flex-column",
        )}
        axis="x"
        distance={9}
        onSortStart={handleSortStart}
        onSortEnd={handleSortEnd}
      >
        {fgaVisibleValuePopulatedParameters.map((valuePopulatedParameter, index) => (
          <StaticParameterWidgetFga
            key={valuePopulatedParameter.id}
            className={cx({ mb2: vertical })}
            isEditing={isEditing}
            isFullscreen={isFullscreen}
            isNightMode={isNightMode}
            parameter={valuePopulatedParameter}
            parameters={parameters}
            dashboard={dashboard}
            editingParameter={editingParameter}
            setEditingParameter={setEditingParameter}
            index={index}
            setValue={
              setParameterValue &&
              (value => setParameterValue(valuePopulatedParameter.id, value))
            }
            commitImmediately={commitImmediately}
            dragHandle={
              isEditing && setParameterIndex ? <SortableParameterHandle /> : null
            }
          />
        ))}
      </ParameterWidgetList>
        {showAdvanced && (
          <div className="flex align-end">
            <Button
              className="cursor-pointer flex align-center mb1"
              style={{ padding: "4px 6px", color: "#7A819B" }}
              onClick={() => {
                setShowNormalVisibleParams(!showNormalVisibleParams)
              }}
            >
              <span>Advanced</span>
              <Icon className="ml1" name={showNormalVisibleParams ? "search_arrow_down" : "search_arrow_up"} size={12}/>
            </Button>
          </div>
        )}
      </div>
      {(!showAdvanced || (showAdvanced && showNormalVisibleParams)) && (
        <ParameterWidgetList
          className={cx(
            className,
            "flex align-end flex-wrap",
            vertical ? "flex-column" : "flex-row",
          )}
          axis="x"
          distance={9}
          onSortStart={handleSortStart}
          onSortEnd={handleSortEnd}
        >
          {normalVisibleValuePopulatedParameters.map((valuePopulatedParameter, index) => (
            <ParameterWidget
              key={valuePopulatedParameter.id}
              className={cx({ mb2: vertical })}
              isEditing={isEditing}
              isFullscreen={isFullscreen}
              isNightMode={isNightMode}
              parameter={valuePopulatedParameter}
              parameters={parameters}
              dashboard={dashboard}
              editingParameter={editingParameter}
              setEditingParameter={setEditingParameter}
              index={index}
              setValue={
                setParameterValue &&
                (value => setParameterValue(valuePopulatedParameter.id, value))
              }
              commitImmediately={commitImmediately}
              dragHandle={
                isEditing && setParameterIndex ? <SortableParameterHandle /> : null
              }
            />
          ))}
        </ParameterWidgetList>
      )}
    </div>
  ) : null;
}

ParametersList.defaultProps = {
  vertical: false,
  commitImmediately: false,
};

export default ParametersList;
