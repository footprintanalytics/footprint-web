/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Button, message, Table } from "antd";
import EditUserUpgradeModal from "metabase/containers/market/upgrade/compoment/edit";
import { updateVipLevel, userList } from "metabase/new-service";

const VipList = props => {
  const { user, vip, searchText } = props;
  const [dataSource, setDataSource] = useState([]);
  const [visible, setVisible] = useState();
  const [currentItem, setCurrentItem] = useState({});

  async function getData(searchText) {
    const { list } = await userList(searchText ? { q: searchText } : undefined);
    setDataSource(list);
  }

  useEffect(() => {
    const run = async () => {
      const hide = message.loading("Loading...", 0);
      await getData(searchText || "");
      hide();
    };
    run();
  }, [searchText]);

  const columns = [
    {
      title: "name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "type",
      dataIndex: "type",
      key: "type",
      className: "upgrade__column-type",
    },
    {
      title: "validEndDate",
      dataIndex: "validEndDate",
      key: "validEndDate",
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 100,
      // eslint-disable-next-line react/display-name
      render: item => {
        return (
          <a
            onClick={e => {
              e.preventDefault();
              setCurrentItem(item);
              setVisible(true);
            }}
          >
            <Button type="primary">Upgrade</Button>
          </a>
        );
      },
    },
  ];

  const editApi = async data => {
    const hide = message.loading("Loading...", 0);
    await updateVipLevel(data);
    await getData(searchText);
    hide();
  };

  return (
    <div className="vip-list" style={{ padding: 20 }}>
      <Table
        pagination={{ position: ["bottomCenter"] }}
        size={"middle"}
        dataSource={dataSource}
        columns={columns}
      />
      {visible && (
        <EditUserUpgradeModal
          user={user}
          vip={vip}
          item={currentItem}
          onSubmit={(value, id) => {
            const data = {
              userId: id,
              type: value.type,
              days: parseInt(value.days),
            };
            editApi(data);
            setCurrentItem({});
            setVisible(false);
          }}
          onClose={() => {
            setCurrentItem({});
            setVisible(false);
          }}
        />
      )}
    </div>
  );
};

export default VipList;
