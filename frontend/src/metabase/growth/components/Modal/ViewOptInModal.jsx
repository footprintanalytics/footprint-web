/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react"
import {
  Modal,
  Select,
  Button,
  Descriptions,
  Input,
  Form,
  message,
  Divider,
  Typography,
} from "antd"
import { CheckSquareOutlined, CloseSquareOutlined } from "@ant-design/icons"
import Link from "antd/lib/typography/Link"
import { withRouter } from "react-router"
import { connect } from "react-redux"
import { CreateFgaProject } from "metabase/new-service"
import { getUser } from "metabase/selectors/user"
import {
  getDashboardDatas,
  getGrowthProjectPath,
  saveLatestGAProject,
  saveLatestGAProjectId,
} from "../../utils/utils"

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}
const tailLayout = {
  wrapperCol: { offset: 0, span: 24 },
}

const ViewOptInModal = props => {
  const { open, onCancel, onSuccess, router, location, user, channel, type } =
    props
  const [detail, setDetail] = useState({})

  useEffect(() => {
    if (channel) {
      setDetail(channel?.details)
      console.log("channel details", channel?.details)
    }
  }, [channel])

  return (
    <Modal
      title="View Opt-In"
      open={open}
      footer={null}
      // onOk={handleOk}
      onCancel={onCancel}
    >
      <Divider />
      <div>
        <Descriptions
          bordered
          layout={type === "Twitter" ? "vertical" : "horizontal"}
          column={4}
        >
          {detail && type === "Twitter" && (
            <Descriptions.Item label="Twitter Uri" span={4}>
              <Link href={detail?.twitterUri} target="_blank" rel="noreferrer">
                {detail?.twitterUri}
              </Link>
            </Descriptions.Item>
          )}
          {detail && type === "Discord" && (
            <>
              <Descriptions.Item label="Wallet Address" span={2}>
                {detail?.walletAddress ? (
                  <CheckSquareOutlined />
                ) : (
                  <CloseSquareOutlined />
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Discord Handler" span={2}>
                {detail?.discordHandler ? (
                  <CheckSquareOutlined />
                ) : (
                  <CloseSquareOutlined />
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Twitter Handler" span={2}>
                {detail?.twitterHandler ? (
                  <CheckSquareOutlined />
                ) : (
                  <CloseSquareOutlined />
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Email" span={2}>
                {detail?.email ? (
                  <CheckSquareOutlined />
                ) : (
                  <CloseSquareOutlined />
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Bot Invit Url" span={4}>
                <Link
                  href={detail?.botInviteUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {detail?.botInviteUrl}
                </Link>
              </Descriptions.Item>
              <Descriptions.Item label="Bot Init Command" span={4}>
                <Typography.Text copyable>{detail?.botInitCmd}</Typography.Text>
              </Descriptions.Item>
            </>
          )}
        </Descriptions>
      </div>
    </Modal>
  )
}

const mapStateToProps = state => {
  return {
    user: getUser(state),
  }
}

export default withRouter(connect(mapStateToProps)(ViewOptInModal))
