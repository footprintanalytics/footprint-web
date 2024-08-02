/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import { getGrowthProjectPath } from "metabase/ab/utils/utils";
import { Skeleton } from "antd";

const PeaQuest = props => {
  const {router, project} = props
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
        router.push(`/fga/game/project/${project?.protocolSlug}/quest_dashboard?campaign_id=${event?.data?.payload?.campaign_id}`);
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
    <div ref={ref}>
      {loading && <div style={{width: "100%", height: iframeHeight, padding: 40}}><Skeleton active /></div>}
      <iframe
        ref={iframeRef}
        src={"https://test.pea.ai/admin/quest/list?app_name=fga&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjgyNjkzMTdlZmYwMzAwMTE1MGU3MGUiLCJpYXQiOjE3MTk4MjI2NDEsImV4cCI6MTcyMjQxNDY0MX0.Ga4I9KBvCxU4tRJYIv2J9ETrNmYSdoW3CxGCYIaKGqc"}
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

export default connect(mapStateToProps)(PeaQuest);
