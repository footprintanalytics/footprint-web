/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { message, Radio, Button, Table, Form, DatePicker, Input } from "antd";
import "./index.css";
import array from "metabase/containers/market/picture/data/data";
import { getUser } from "metabase/selectors/user";
import connect from "react-redux/lib/connect/connect";
import moment from "moment-timezone";
import { CalendarOutlined } from "@ant-design/icons";
import { Checkbox } from 'metabase/core/components/CheckBox';
const Market = props => {
  const { user } = props;

  const [data, setData] = useState();
  const [item, setItem] = useState();
  const [title, setTitle] = useState();
  const defaultDate = moment();
  const defaultDateStr = moment(defaultDate).format("YYYY-MM-DD");
  const [settingValues, setSettingValues] = useState({date: defaultDateStr, hideRow: []});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (settingValues) {
      const selectedItem = array.find(item => item.title === settingValues.template);
      if (selectedItem) {
        handleOnclick(selectedItem);
      }
    }
  }, [settingValues]);

  const renderPicHtml = () => {
    if (!item?.data) {
      return null
    }
    const endDate = new Date(settingValues.date);
    const startDate = new Date(settingValues.date);
    startDate.setDate(endDate.getDate() - 6); // 获取前6天作为开始日期

    function formatDateRange(startDate, endDate) {
      const options = { month: 'short', day: 'numeric' };
      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();

      const startStr = startDate.toLocaleDateString('en-US', options);
      const endStr = endDate.toLocaleDateString('en-US', options);

      if (startYear !== endYear) {
        return `${startStr}, ${startYear} - ${endStr}, ${endYear}`;
      } else if (startDate.getMonth() !== endDate.getMonth()) {
        return `${startStr} - ${endStr}, ${endYear}`;
      } else {
        return `${startStr} - ${endStr}, ${endYear}`;
      }
    }

    return (
      <div id="snapshot" className="market__picture_root" style={{ backgroundImage: `url(${item.background})`}}>
        {item?.template === "template1" && (<div className="market__picture_left">
            <span className="market__picture_title">Top Games</span>
            <span className="market__picture_title_sub">{title}</span>
            <span className="market__picture_title_date"><CalendarOutlined />{formatDateRange(startDate, endDate)}</span>
          </div>
        )}
        {item?.template === "template2" && (
          <div>
            <span className="market__picture_title_sub_template2">{title}</span>
            <span className="market__picture_title_date_template2"><CalendarOutlined />{formatDateRange(startDate, endDate)}</span>
          </div>
        )}
        <div className={`market__picture_table ${item?.template === "template1" ? "market__picture_table_template1" : "market__picture_table_template2"}`}>
          {item && data && <Table
            dataSource={data}
            columns={item.tableColumnFunction(item)}
            pagination={false}
            className="market__picture_table_custom"
            style={{
              background: 'transparent',
            }}
          />
        }
        </div>

      </div>
    )
  }

  if (user && !user.isMarket) {
    return (
      <div className="market__nodata">
        No content displayed, please contact the administrator
      </div>
    );
  }


  const handleOnclick = async (item) => {
    if (!item) {
      return null
    }
    setLoading(true);
    setData(undefined);
    setItem(undefined);
    setTitle(undefined);

    try {
      const data = await item.parseData(item.getApiUrl(settingValues.ignoreCache === "yes" ? true : false, settingValues.date), settingValues.hideRow);
      console.log("data", data)
      setData(data)
      setItem({...item, data})
      setTitle(item.title);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="market">
      <div className="market__list">
        <Form
          onFinish={(values) => {
            console.log("values", values)
            setSettingValues({
              ...values,
              date: values.date?.format('YYYY-MM-DD') || defaultDateStr,
              hideRow: values.hideRows?.split(',')?.map(num => parseInt(num.trim()))?.filter(num => !isNaN(num)) || []
            });
          }}
        >
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            label="Hide Rows"
            name="hideRows"
          >
            <Input
              placeholder="Enter row numbers to hide (e.g. 0,2,6)"
            />
          </Form.Item>

          <Form.Item
            label="Ignore Cache"
            name="ignoreCache"
          >
            <Radio.Group defaultValue={"no"}>
              <Radio key="no" value={"no"}>No</Radio>
              <Radio key="yes" value={"yes"}>Yes</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Template"
            name="template"
            rules={[{ required: true, message: 'Please select a template' }]}
            initialValue={array[0]?.title}
          >
            <Radio.Group direction="vertical">
              {array.map(item => (
                <Radio key={item.title} value={item.title}>
                  {item.title}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: '200px' }}>
              Go
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div className="market__display">
        {renderPicHtml()}
        {/*<button onClick={handleDownload}>Download as PNG</button>*/}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  user: getUser(state),
});

export default connect(mapStateToProps)(Market);
