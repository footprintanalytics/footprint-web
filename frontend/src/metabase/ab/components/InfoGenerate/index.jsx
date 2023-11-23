/* eslint-disable react/prop-types */
import React , {useState} from "react";
// import Link from "antd/lib/typography/Link";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import { message, Tooltip, Button } from "antd";
import CopyToClipboard from "react-copy-to-clipboard";
import { tokenGeneral } from "metabase/new-service";
import { loadCurrentFgaProjectNew } from "metabase/redux/user";
import Icon from "metabase/components/Icon";
import {
  CopyOutlined
} from "@ant-design/icons";

const InfoGenerate = props => {
  const { project, loadCurrentFgaProjectNew } = props;
  const [token, setToken] = useState()
  const createToken = async () => {
    const hide = message.loading("General token...", 20000);
    const {token} = await tokenGeneral({ projectId: project?.id });
    hide();
    setToken(token)
    loadCurrentFgaProjectNew(project?.protocolSlug, true, false)
  }
  return (
    <div className="flex flex-col">
      <div className="flex flex-col" style={{ fontSize: 20 }}>
        <div className="flex align-center">
          <div>Project ID</div>
          <Tooltip title={"Unique id of the project"}><Icon className="ml1" name={"info"} size={16}/></Tooltip>
        </div>
        <div className="flex align-center mt1">{project?.id}
          <CopyToClipboard
            text={`${project?.id}`}
            onCopy={() => {
              message.success("Copied!");
            }}
          >
            <Tooltip title={`Copy ID`}>
              <a className="ml1"><CopyOutlined /></a>
            </Tooltip>
          </CopyToClipboard>
        </div>
      </div>
      <div className="flex flex-col mt4" style={{ fontSize: 20 }}>
        <div className="flex align-center">
          <div>Project Token</div>
          <Tooltip title={"The token of the project is used as a credential for SDK requests. For security purposes, please manage it properly and do not disclose it to others."}>
            <Icon className="ml1" name={"info"} size={16}/>
          </Tooltip>
        </div>
        {project?.token || token ? (
        <div className="flex align-center mt1">{"************************************"}
          <CopyToClipboard
            text={project?.token || token}
            onCopy={() => {
              message.success("Copied!");
            }}
          >
            <Tooltip title={`Copy token`}>
              <a className="ml1"><CopyOutlined /></a>
            </Tooltip>
          </CopyToClipboard>
        </div>
        ):(<div>
          <Button
            className="mt1"
            onClick={() => {
              createToken();
            }}
          >
            General Token
          </Button>
        </div>)
        }
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

const mapDispatchToProps = {
  loadCurrentFgaProjectNew
};
export default connect(mapStateToProps, mapDispatchToProps)(InfoGenerate);
