/* eslint-disable react/prop-types */
import { Button, Card, message } from "antd";
import React, { useState } from "react";
import CreateProjectModalForDemo from "metabase/ab/components/Modal/CreateProjectModalForDemo";

const FgaCreateProjectGuide = (props) => {
  const { user, setLoginModalShow, setCreateFgaProjectModalShowAction } = props
  const [state, setState] = useState(1);
  return (
    <div className="flex flex-col h-full items-center pt4" style={{background: '#101014'}}>
      <Card className="flex flex-col justify-center items-center" style={{gap: 30, }}>
        <div className="flex flex-col justify-center items-center" style={{gap: 30, padding: 40, width: 600}}>
          {state === 1 && (
            <div className="flex flex-column" style={{gap: 30}}>
              <h1>Welcome to Footprint Growth Analytics</h1>
              <span>Unlock your growth potential in a web3 world. Dive into data insights and get an edge in your marketing strategy with Footprint GA by bringing all of your Web2 and Wed3 data sources together.</span>
              <div className="flex justify-end">
                <Button
                  type="primary"
                  onClick={() => {
                    if (!user) {
                      message.info("Kindly login first, please");
                      setLoginModalShow({ show: true });
                      return;
                    }
                    // setCreateFgaProjectModalShowAction({ show: true });
                    setState(2)
                  }
                }>Create Project</Button>
              </div>
            </div>
          )}
          {state === 2 && (
            <div className="flex flex-column" style={{gap: 30}}>
              <CreateProjectModalForDemo isModal={false} />
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default FgaCreateProjectGuide
