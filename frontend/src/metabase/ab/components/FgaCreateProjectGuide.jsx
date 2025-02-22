/* eslint-disable react/prop-types */
import { Card } from "antd";
import React from "react";
import CreateProjectModalForFgaPro from "metabase/ab/components/Modal/CreateProjectModalForFgaPro";
import LoginModal from "metabase/auth/containers/LoginModal";

const FgaCreateProjectGuide = (props) => {
  const { user, } = props
  const state = user ? 2 : 1
  return (
    <div className="flex flex-col h-full items-center pt4" style={{background: '#101014'}}>
      <Card className="flex flex-col justify-center items-center" style={{gap: 30, }}>
        <div className="flex flex-col justify-center items-center" style={{gap: 30, padding: 20, width: user ? 820 : 600}}>
          {/*显示登录页面*/}
          {state === 1 && (
            <div className="flex flex-column" >
              <div className="flex flex-column items-center">
                <h1>Welcome to <br/> Footprint Growth Analytics (FGA)</h1>
              </div>
              {/*<span>Unlock your growth potential in a web3 world. Dive into data insights and get an edge in your marketing strategy with Footprint GA by bringing all of your Web2 and Wed3 data sources together.</span>*/}
              <LoginModal
                redirect="/fga/pro"
                fromNav={false}
                hideClose={true}
                showLeftSlider={false}
              />
            </div>
          )}
          {/*显示 create project 页面*/}
          {state === 2 && (
            <div className="flex flex-column" style={{gap: 30, width: "100%"}}>
              <CreateProjectModalForFgaPro isModal={false} isOnboard={true}/>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default FgaCreateProjectGuide
