/* eslint-disable react/prop-types */
import React, { useState } from "react";
import "../../css/index.css";
import "./index.css";
import CategoryForFga from "metabase/containers/protocols/components/Protocols/CategoryForFga";
import Button from "metabase/core/components/Button";
import Profile from "./Profile";
import Filter from "./Filter";
import Total from "./Total";
import { remove } from "lodash";
import CreateCohort2 from "metabase/growth/containers/PotentialUsers/CreateFliterCohort";
import { push } from "react-router-redux";
import { getUser } from "metabase/selectors/user";
import { connect } from "react-redux";

const PotentialUsers = props => {
  const {project} = props;
  const data = "bluechip_holder,diamond_hand,whale,nft_smart_money,flashbot,sybil,nft_hunter,high_buying_power,active_nft_trader,blur_airdrop_wallets".split(",")
  const excludeData = "flashbot,sybil".split(",")
  const [tags, setTags] = useState([]);
  const [excludeTags, setExcludeTags] = useState([]);
  const [filterArray, setFilterArray] = useState([]);

  const [filterResult, setFilterResult] = useState();

  const createTotalSql = ({tags, excludeTags}) => {
    const sql = "with total_tag as(" + "\n" +
      "    select \n" +
      "    entity_id as wallet_address\n" +
      "    ,tag_name\n" +
      "    from iceberg.footprint.fga_address_tag \n" +
      ") \n" +
      "select \n" +
      "count(distinct wallet_address)\n" +
      "from\n" +
      "user_profile\n" +
      "where 1=1 \n"
      const t1 = tags ? tags?.map(s => ` and wallet_address in (select wallet_address from total_tag address_tag where tag_name='${s}') \n`)?.join(" ") : ""
      const t2 = excludeTags ? excludeTags?.map(s => `and wallet_address not in (select wallet_address from total_tag address_tag where tag_name='${s}')\n`)?.join(" ") : ""
    ;
    return `${sql}${t1}${t2}`
  }

  const createPieSql = ({tags, excludeTags}) => {
    const t1 = tags ? tags?.map(s => ` and wallet_address in (select wallet_address from total_tag address_tag where tag_name='${s}') \n`)?.join(" ") : ""
    const t2 = excludeTags ? excludeTags?.map(s => `and wallet_address not in (select wallet_address from total_tag address_tag where tag_name='${s}')\n`)?.join(" ") : ""
    const sql = "with total_tag as(" + "\n" +
      "    select \n" +
      "    entity_id as wallet_address\n" +
      "    ,tag_name\n" +
      "    from iceberg.footprint.fga_address_tag \n" +
      "), \n" +
      "wallets as (\n" +
      "    select \n" +
      "    distinct wallet_address as wallet_address\n" +
      "    from\n" +
      "    user_profile\n" +
      "    where 1=1 \n" +
      "    and wallet_address in (select wallet_address from total_tag address_tag where tag_name='diamond_hand')\n" +
      "    and wallet_address not in (select wallet_address from total_tag address_tag where tag_name='B')\n" +
      `${t1}` + "\n" +
      `${t2}` + "\n" +
      "    limit 1000\n" +
      ")" +
      "\n" +
      "\n" +
      "select tag_name as tag, count(*) as wallets " +
      "from total_tag " +
      "where wallet_address in (select wallet_address from wallets) group by 1 order by 2 desc \n"
    return `${sql}`
  }
  let filterValueArray = [];
  const handleFilterObject = object => {
    if (!object?.key) {
      return ;
    }
    if (filterValueArray.length === 0 || !filterValueArray?.map(item => item.key).includes(object?.key)) {
      filterValueArray = [...filterValueArray, object]
    } else {
      remove(filterValueArray, (item) => item.key === object?.key)
      filterValueArray = [...filterValueArray, object]
    }
  }

  return (
    <div className="flex flex-column">
      <div className="potential-users__filter">
        <h2>Filter</h2>
        <div className="flex flex-column">
          <CategoryForFga
            data={data}
            router={null}
            title={"Include tag"}
            isLoading={false}
            actives={tags}
            onChange={array => setTags(array)}
          />
          <CategoryForFga
            data={excludeData}
            router={null}
            title={"Exclude tag"}
            isLoading={false}
            actives={excludeTags}
            onChange={array => setExcludeTags(array)}
          />
          {filterArray.map(item => <Filter key={item} onChange={object => {
            handleFilterObject(object)
          }}/>)}

          <div className="flex">
            <Button onClick={() => {
              const array = filterArray;
              array.push(filterArray.length + 1);
              setFilterArray([...array]);
            }}>Add filter</Button>
            <Button onClick={() => {
              setFilterResult({
                tags: tags,
                excludeTags: excludeTags,
                filter: filterValueArray,
                totalSql: createTotalSql({ tags, excludeTags }),
                pieDataSql: createPieSql({ tags, excludeTags }),
              });
            }}>Run</Button>
          </div>
        </div>
      </div>
      <div className="potential-users__profile">
        <h2>Profile</h2>
        {filterResult && <div className="flex justify-end">
          <CreateCohort2 project={project}/>
        </div> }
        <div className="flex">
          {filterResult &&
          (
            <div className="Potential-Users__condition">
              <ul style={{ whiteSpace: "pre-line" }}>
                <div>{`Include tags: ${filterResult.tags?.join(",")}`}</div>
                <div>{`Exclude tags: ${filterResult.excludeTags?.join(",")}`}</div>
                {filterResult.filter?.map(item => <li key={item.key}>{`${item.key}: ${item.operator} ${item.value}`}</li>)}
              </ul>
            </div>
          )}
          {filterResult && (
            <div className="Potential-Users__total">
              <Total sql={filterResult?.totalSql}/>
            </div>
          )}
        </div>
        {filterResult?.pieDataSql && (<Profile sql={filterResult.pieDataSql}/>)}
      </div>

    </div>

  );
};

const mapDispatchToProps = {
  onChangeLocation: push,
};
const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PotentialUsers);
