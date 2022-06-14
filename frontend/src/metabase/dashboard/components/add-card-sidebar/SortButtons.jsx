import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box } from "grid-styled";
import Icon from "metabase/components/Icon";

SortButtons.propTypes = {
  onSelect: PropTypes.func.isRequired,
  currentTab: PropTypes.string,
  initialCollection: PropTypes.number,
};

// export const sortButtons = new Array();

export const sortButtons = [
  { title: "Views", key: "views", isUp: false },
  { title: "Date", key: "created_at", isUp: false },
  { title: "Name", key: "name", isUp: false },
];

export function SortButtons(props) {
  const [currentItem, setCurrentItem] = useState({});
  const [currentTab, setCurrentTab] = useState();
  const { onSelect } = props;
  useEffect(() => {
    onSelect({ type: currentTab, sort: currentItem });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentItem]);

  useEffect(() => {
    if (props.currentTab) {
      setCurrentTab(props.currentTab);
      if (props.currentTab === "mine") {
        setCurrentItem(sortButtons[1]);
      } else if (props.currentTab === "community") {
        setCurrentItem(sortButtons[0]);
      }
    }
  }, [props.currentTab]);

  return (
    <div className="flex flex-row flex-full my1">
      <Box className="flex-full" />
      {sortButtons.map(item => {
        return (
          <SortButtonItem
            key={item.key}
            item={item}
            onSelect={item => {
              setCurrentItem(item);
            }}
            currentItem={currentItem}
          />
        );
      })}
    </div>
  );
}

SortButtonItem.propTypes = {
  currentItem: PropTypes.object,
  item: PropTypes.object,
  onSelect: PropTypes.func,
};
function SortButtonItem(props) {
  const [itemData, setItemData] = useState(props.item);
  const [isSelected, setIsSelected] = useState(false);
  useEffect(() => {
    setIsSelected(props.currentItem.key === itemData.key);
    if (props.currentItem.key !== itemData.key) {
      if (itemData.isUp) {
        const itemTemp = { ...itemData };
        itemTemp.isUp = false;
        setItemData(itemTemp);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemData.key, props.currentItem.key]);
  const handleSelect = () => {
    if (isSelected) {
      const itemTemp = { ...itemData };
      itemTemp.isUp = !itemTemp.isUp;
      setItemData(itemTemp);
      props.onSelect(itemTemp);
    } else {
      setIsSelected(true);
      props.onSelect(itemData);
    }
  };
  return (
    <div
      className="cursor-pointer"
      style={{
        color: `${isSelected ? "#3434b2" : "#666c80"}`,
        fontSize: "12px",
        padding: "12px 10px",
      }}
      onClick={handleSelect}
    >
      <span style={{ marginRight: "4px" }}> {itemData.title}</span>
      {itemData.isUp ? (
        <Icon name={"arrow_up"} size={10}></Icon>
      ) : (
        <Icon name={"arrow_down"} size={10}></Icon>
      )}
    </div>
  );
}
