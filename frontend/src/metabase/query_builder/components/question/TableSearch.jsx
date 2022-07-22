/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React from "react";
import { debounce } from "lodash";
import * as MetabaseAnalytics from "metabase/lib/analytics";
import Search from "antd/es/input/Search";
import MyPopover from "metabase/query_builder/components/MyPopover";

const TableSearch = props => {
  const {
    isEditing,
    setSearchKey,
    searchLoading,
    databases,
    formDataSelector,
  } = props;

  /*  useEffect(() => {
    const recentData = async () => {
      setRecentTable([]);
      const { list } = await recentTableList({
        databaseId,
        project: getProject(),
      });
      setRecentTable(list || []);
    };
    !isDefi360() && recentData();
  }, [databaseId, setRecentTable]);*/

  const changeHandler = debounce(val => {
    setSearchKey(val);
    MetabaseAnalytics.trackStructEvent(`question-side search ${val}`);
  }, 500);

  /* const menu =
    recentTable?.length && searchKeyValue?.length === 0 && !formDataSelector ? (
      <Menu className="question-side__recent">
        <div className="question-side__recent-title">Recent</div>
        {recentTable.map(table => {
          return (
            <Menu.Item
              key={`${table.id}${table.name}`}
              onClick={() => {
                handleSelectTable({
                  tableId: table.id,
                  tableName: table.name,
                });
              }}
            >
              <div className="question-side__recent-item">
                <span className="question-side__recent-item-title">
                  {table.name}
                </span>
                <span className="question-side__recent-item-time">
                  {moment(new Date(table.last_created_at)).format("YYYY-MM-DD")}
                </span>
              </div>
            </Menu.Item>
          );
        })}
      </Menu>
    ) : (
      <div />
    );*/

  return (
    <MyPopover
      name="questionSideSearch"
      enabled={!isEditing && !formDataSelector}
      placement="right"
      delayModel
      delayShow={!!databases}
    >
      {/*<Dropdown overlay={menu} trigger={["click"]}>*/}
      <Search
        allowClear
        placeholder="Search dataset..."
        onChange={e => changeHandler(e.target.value)}
        className="question-side__search"
        loading={searchLoading}
      />
      {/*</Dropdown>*/}
    </MyPopover>
  );
};
export default TableSearch;
