/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import { getGrowthProjectPath } from "metabase/ab/utils/utils";
import { Skeleton } from "antd";

const PeaPage = props => {
  const {router, project, url} = props
  const protocolSlug = project?.protocolSlug
  const ref = React.useRef();
  const iframeRef = useRef(null);
  const [iframeHeight, setIframeHeight] = useState(window.innerHeight - 66);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleMessage = (event) => {

      // 处理接收到的数据
      console.log('Received message in React component:', event.data);
      // 在这里处理接收到的数据，可以根据数据内容执行不同的操作
      if (event?.data?.event === "create_segment") {
        router.push({
          pathname: getGrowthProjectPath(
            protocolSlug,
            "members",
          ),
        });
      } else if (event?.data?.event === "campaign_analysis") {
        console.log("xxxxxx", `/growth-fga/quest_dashboard?campaign_id=${event?.data?.payload?.campaign_id}`)
        router.push(`/growth-fga/quest_dashboard?campaign_id=${event?.data?.payload?.campaign_id}`);
      }
    };
    window.addEventListener('message', handleMessage);

    // 在组件卸载时移除postMessage事件监听器
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);


  const handleIframeLoad = () => {
    setLoading(false);
  };

  return (
    <div ref={ref} style={{width: "100%"}}>
      {loading && <div style={{width: "100%", height: iframeHeight, padding: 40}}><Skeleton active /></div>}
      <iframe
        ref={iframeRef}
        src={url}
        style={{ border: 'none', width: '100%', height: iframeHeight, display: loading ? 'none' : 'block' }}
        onLoad={handleIframeLoad}
      />
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(PeaPage);
