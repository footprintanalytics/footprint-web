import { apiGet } from "metabase/new-service";
import zipObject from "lodash/zipObject";
import camelCase from "lodash/camelCase";
import orderBy from "lodash/orderBy";
import * as draw from "../template/draw";
import { getPublicCardUrl } from "metabase/containers/market/picture/utils/apiUtil";
import { Avatar } from "antd";
import React from "react";
import { template } from "underscore";

const chainLogoArray = [
  {
    name: "arbitrum",
    logo: "https://static.footprint.network/chain/arbitrum.png",
  },
  {
    name: "avalanche",
    logo: "https://static.footprint.network/chain/avalaunch.png",
  },
  {
    name: "binance",
    logo: "https://static.footprint.network/chain/binance.png",
  },
  { name: "celo", logo: "https://static.footprint.network/chain/celo.png" },
  { name: "cronos", logo: "https://static.footprint.network/chain/cronos.png" },
  {
    name: "defichain",
    logo: "https://static.footprint.network/chain/defichain.png",
  },
  { name: "elrond", logo: "https://static.footprint.network/chain/elrond.png" },
  {
    name: "ethereum",
    logo: "https://static.footprint.network/chain/ethereum.png",
  },
  { name: "fantom", logo: "https://static.footprint.network/chain/fantom.png" },
  { name: "heco", logo: "https://static.footprint.network/chain/heco.png" },
  { name: "kava", logo: "https://static.footprint.network/chain/kava.png" },
  { name: "klaytn", logo: "https://static.footprint.network/chain/klaytn.png" },
  { name: "terra", logo: "https://static.footprint.network/chain/luna.png" },
  { name: "polygon", logo: "https://static.footprint.network/chain/matic.png" },
  {
    name: "osmosis",
    logo: "https://static.footprint.network/chain/osmosis.png",
  },
  { name: "ronin", logo: "https://static.footprint.network/chain/ronin.png" },
  { name: "solana", logo: "https://static.footprint.network/chain/solana.png" },
  { name: "stacks", logo: "https://static.footprint.network/chain/stacks.png" },
  { name: "tron", logo: "https://static.footprint.network/chain/tron.png" },
  { name: "waves", logo: "https://static.footprint.network/chain/waves.png" },
];

const array = [
  {
    title: "by Active User Growth \nWoW",
    template: "template1",
    background: "https://static.footprint.network/img_market_picture_ranking_v3.png",
    tableColumnFunction: (item) => getColumnsSettingByTemplate1(item),
    getApiUrl: (ignoreCache, dateValue) => {
      return getPublicCardUrl({
        uuid: "8ff3209b-388b-4d0d-b4e3-a45372a4c2a4",
        dashcardId: 85071,
        cardId: 45481,
        parameters: encodeURIComponent(JSON.stringify([{"name":"Date","slug":"date-84631","id":"6cafa858","type":"date/single","sectionId":"date","dashcardId":84631,"default":"2024-12-21","value": dateValue,"target":["variable",["template-tag","on_date"]]},{"name":">= Current Data","slug":"%3E%3D_current_data-84632","id":"361b9391","type":"id","sectionId":"id","dashcardId":84632,"default":"1000","value":["1000"],"target":["variable",["template-tag","Wallets"]]}])),
        ignore_cache: ignoreCache,
      })
    },
    parseData: async (api, hideRows) => {
      const { rows, cols } = await apiGet(api);
      const objectData = rows.map(item =>
        zipObject(
          cols.map(p => camelCase(p.name)),
          item,
        ),
      );
      return objectData.filter((_, index) => !hideRows?.includes(index))?.slice(0, 10);
    },
    tableColumns: [
      {
        title: '',
        dataIndex: 'logo',
        key: 'logo',
      },
      {
        title: 'Name',
        dataIndex: 'protocolName',
        key: 'protocolName',
      },
      {
        title: 'Change%',
        dataIndex: 'growthRateWoW',
        key: 'growthRateWoW',
      },
      {
        title: 'Active Users',
        dataIndex: 'activeUsers',
        key: 'activeUsers',
      }
    ]
  },
  {
    title: "by New User Growth \nWoW",
    template: "template1",
    background: "https://static.footprint.network/img_market_picture_ranking_v3.png",
    tableColumnFunction: (item) => getColumnsSettingByTemplate1(item),
    getApiUrl: (ignoreCache, dateValue) => {
      return getPublicCardUrl({
        uuid: "8ff3209b-388b-4d0d-b4e3-a45372a4c2a4",
        dashcardId: 96234,
        cardId: 48738,
        parameters: encodeURIComponent(JSON.stringify([{"name":"Date","slug":"date-84631","id":"6cafa858","type":"date/single","sectionId":"date","dashcardId":84631,"default":"2024-12-21","value": dateValue,"target":["variable",["template-tag","on_date"]]},{"name":">= wallets","slug":"%3E%3D_wallets-96469","id":"5f9ebfc7","type":"number/=","sectionId":"number","dashcardId":96469,"default":"500","value":[500],"target":["variable",["template-tag","Wallets"]]}])),
        ignore_cache: ignoreCache,
      })
    },
    parseData: async (api, hideRows) => {
      const { rows, cols } = await apiGet(api);
      const objectData = rows.map(item =>
        zipObject(
          cols.map(p => camelCase(p.name)),
          item,
        ),
      );
      return objectData.filter((_, index) => !hideRows?.includes(index))?.slice(0, 10);
    },
    tableColumns: [
      {
        title: '',
        dataIndex: 'logo',
        key: 'logo',
      },
      {
        title: 'Name',
        dataIndex: 'protocolName',
        key: 'protocolName',
      },
      {
        title: 'Change%',
        dataIndex: 'growthRateWoW',
        key: 'growthRateWoW',
      },
      {
        title: 'New Users',
        dataIndex: 'newUsers',
        key: 'newUsers',
      }
    ],
  },
  {
    title: "by New User Retention \nWoW",
    template: "template1",
    background: "https://static.footprint.network/img_market_picture_ranking_v3.png",
    tableColumnFunction: (item) => getColumnsSettingByTemplate1(item),
    getApiUrl: (ignoreCache, dateValue) => {
      return getPublicCardUrl({
        uuid: "8ff3209b-388b-4d0d-b4e3-a45372a4c2a4",
        dashcardId: 96235,
        cardId: 48742,
        parameters: encodeURIComponent(JSON.stringify([{"name":"Date","slug":"date-84631","id":"6cafa858","type":"date/single","sectionId":"date","dashcardId":84631,"default":"2024-12-21","value":dateValue,"target":["variable",["template-tag","on_date"]]},{"name":">= wallets","slug":"%3E%3D_wallets-96469","id":"5f9ebfc7","type":"number/=","sectionId":"number","dashcardId":96469,"default":"500","value":[500],"target":["variable",["template-tag","new_wallets"]]}])),
        ignore_cache: ignoreCache,
      })
    },
    parseData: async (api, hideRows) => {
      const { rows, cols } = await apiGet(api);
      const objectData = rows.map(item =>
        zipObject(
          cols.map(p => camelCase(p.name)),
          item,
        ),
      );
      return objectData.filter((_, index) => !hideRows?.includes(index))?.slice(0, 10);
    },
    tableColumns: [
      {
        title: '',
        dataIndex: 'logo',
        key: 'logo',
      },
      {
        title: 'Name',
        dataIndex: 'protocolName',
        key: 'protocolName',
      },
      {
        title: 'Retention Rate%',
        dataIndex: 'retentionRate',
        key: 'retentionRate',
      },
      {
        title: 'Retained Users',
        dataIndex: 'retentionAddresses',
        key: 'retentionAddresses',
      },
    ],
  },
  {
    title: "Top Games Ranked by Token Price WoW Growth Rate",
    template: "template2",
    background: "https://static.footprint.network/img_market_picture_ranking_template2_v6.png",
    tableColumnFunction: (item) => getColumnsSettingByTemplate2(item),
    getApiUrl: (ignoreCache, dateValue) => {
      return getPublicCardUrl({
        uuid: "8ff3209b-388b-4d0d-b4e3-a45372a4c2a4",
        dashcardId: 85864,
        cardId: 45477,
        parameters: encodeURIComponent(JSON.stringify([{"name":"Date","slug":"date-84631","id":"6cafa858","type":"date/single","sectionId":"date","dashcardId":84631,"default":"2024-12-21","value":dateValue,"target":["variable",["template-tag","on_date"]]},{"name":">= Token Volume","slug":"%3E%3D_token_volume-93391","id":"877604a5","type":"number/=","sectionId":"number","dashcardId":93391,"default":"100000","value":[100000],"target":["variable",["template-tag","token_volume"]]}])),
        ignore_cache: ignoreCache,
      })
    },
    parseData: async (api, hideRows) => {
      const { rows, cols } = await apiGet(api);
      const objectData = rows.map(item =>
        zipObject(
          cols.map(p => camelCase(p.name)),
          item,
        ),
      );
      return objectData.filter((_, index) => !hideRows?.includes(index))?.slice(0, 10);
    },
    tableColumns: [
      {
        title: '',
        dataIndex: 'logo',
        key: 'logo',
      },
      {
        title: 'Name',
        dataIndex: 'protocolName',
        key: 'protocolName',
      },
      {
        title: 'Token Name',
        dataIndex: 'tokenName',
        key: 'tokenName',
      },
      {
        title: 'Token Price',
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: 'Change%',
        dataIndex: 'priceChangeRatio7D',
        key: 'priceChangeRatio7D',
      }
    ],
  },
];

export default array;


export const getColumnsSettingByTemplate1 = (item) => {
  return [
    {
      ...item?.tableColumns?.[0],
      width: 50,
      render: (text) => {
        return <Avatar src={text} alt="logo" size={28} shape="circle" />
      }
    },
    {
      ...item?.tableColumns?.[1],
      width: 240,
      render: (text) => {
        if (!text) {
          return <span>-</span>
        }
        return (
          <span
            style={{
              fontSize: '16px',
              color: 'white',
              fontWeight: 'bold',
              fontFamily: 'Montserrat, sans-serif',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'block',
              maxWidth: '240px'
            }}
          >
            {text}
          </span>
        )
      }
    },
    {
      ...item?.tableColumns?.[2],
      width: 240,
      align: 'right',
      render: (text) => {
        if (!text) {
          return <span>-</span>
        }
        return <span style={{ fontFamily: 'Montserrat, sans-serif' }}>{Number((text * 100).toFixed(1)).toLocaleString()}%</span>
      }
    },
    {
      ...item?.tableColumns?.[3],
      align: 'right',
      width: 240,
      render: (text) => {
        if (!text) {
          return <span>-</span>
        }
        return <span style={{ fontFamily: 'Montserrat, sans-serif' }}>{text.toLocaleString()}</span>
      }
    },
  ];
}

export const getColumnsSettingByTemplate2 = (item) => {
  return [
    {
      ...item?.tableColumns?.[0],
      width: 60,
      render: (text) => {
        return <Avatar src={text} alt="logo" size={28} shape="circle" />
      }
    },
    {
      ...item?.tableColumns?.[1],
      width: 200,
      render: (text) => {
        if (!text) {
          return <span>-</span>
        }
        return (
          <span
            style={{
              fontSize: '16px',
              color: 'white',
              fontWeight: 'bold',
              fontFamily: 'Montserrat',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'block',
              maxWidth: '200px'
            }}
          >
            {text}
          </span>
        )
      }
    },
    {
      ...item?.tableColumns?.[2],
      width: 180,
      render: (text) => {
        if (!text) {
          return <span>-</span>
        }
        return (
          <span
            style={{
              fontSize: '14px',
              color: 'white',
              fontFamily: 'Montserrat',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'block',
              maxWidth: '180px'
            }}
          >
            {text}
          </span>
        )
      }
    },
    {
      ...item?.tableColumns?.[3],
      align: 'left',
      width: 150,
      render: (text) => {
        if (!text) {
          return <span>-</span>
        }
        return <span style={{ fontFamily: 'Montserrat' }}>${Number(text).toPrecision(4)}</span>
      }
    },
    {
      ...item?.tableColumns?.[4],
      align: 'left',
      render: (value, record, index) => {
        if (!value) {
          return <span>-</span>
        }

        // 获取当前列所有数据中的最大值
        const maxValue = Math.max(...item.data?.map(row => row[item.tableColumns[4].dataIndex]) || []);

        // 根据最大值计算百分比
        const percentage = value / maxValue;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              flex: 1,
              height: '24px',
              borderRadius: '3px',
              overflow: 'hidden',
              position: 'relative',
              display: "flex",
              gap: 10,
              alignItems: 'center',
            }}>
              <div style={{
                width: `${260 * percentage}px`,
                height: '14px',
                background: '#6D9FEC',
                borderRadius: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '8px'
              }}>
              </div>
              <span style={{
                fontSize: '14px',
                color: 'white'
              }}>
                {(value * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        )
      }
    },
  ];
}
