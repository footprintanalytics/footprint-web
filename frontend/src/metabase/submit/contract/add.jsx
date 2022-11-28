import "./index.css";
import React, { useState } from "react";
import {
  Steps,
  Form,
  Button,
  Input,
  Select,
  Alert,
  List,
  Checkbox,
  Tooltip,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const SubmitContractAdd = () => {
  const [current, setCurrent] = useState(0);

  const ContractAddress = () => {
    return (
      <Form layout="vertical">
        <Form.Item label="Blockchain">
          <Select
            defaultValue="Ethereum"
            options={[{ value: "Ethereum", label: "Ethereum" }]}
          />
        </Form.Item>
        <Form.Item label="Contract Address">
          <Input
            placeholder="Enter contract address"
            defaultValue="0x948c78e96be10aaf90741cb28ae4793df9f93066"
            suffix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
          />
        </Form.Item>
        <Form.Item>
          <Alert
            message="Seems like this contract already exists"
            description={
              <List itemLayout="horizontal">
                <List.Item>
                  <List.Item.Meta
                    title={
                      <span
                        style={{ color: "rgba(0,0,0,.45)", fontWeight: 400 }}
                      >
                        Project Name
                      </span>
                    }
                    description={
                      <span style={{ color: "#303440" }}>
                        Veg Out Hare Club
                      </span>
                    }
                  />
                </List.Item>
                <List.Item>
                  <List.Item.Meta
                    title={
                      <span
                        style={{ color: "rgba(0,0,0,.45)", fontWeight: 400 }}
                      >
                        Contract Name
                      </span>
                    }
                    description={
                      <span style={{ color: "#303440" }}>VegOutHareClub</span>
                    }
                  />
                </List.Item>
              </List>
            }
            type="warning"
            showIcon
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary">Still to submit</Button>
        </Form.Item>
      </Form>
    );
  };

  const ContractDetails = () => {
    return (
      <Form layout="vertical">
        <Form.Item label="Project name">
          <Input
            placeholder="Enter project name"
            defaultValue="Veg Out Hare Club"
          />
        </Form.Item>
        <Form.Item label="Project category">
          <Select
            defaultValue="NFT"
            options={[{ value: "NFT", label: "NFT" }]}
          />
        </Form.Item>
        <Form.Item label="Contract Address">
          <Input
            disabled
            placeholder="Enter contract address"
            defaultValue="0x948c78e96be10aaf90741cb28ae4793df9f93066"
          />
        </Form.Item>
        <Form.Item label="ABI">
          <Input.TextArea
            placeholder="Enter ABI"
            rows={4}
            spellCheck={false}
            defaultValue={`[{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint256","name":"_maxMint","type":"uint256"},{"internalType":"uint256","name":"_porfit","type":"uint256"},{"internalType":"uint256","name":"_maxTotal","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"},{"internalType":"uint256","name":"_mintTime","type":"uint256"},{"internalType":"string","name":"_baseTokenURI","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseTokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"blindBoxOpen","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"blindTokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newRedCat","type":"address"}],"name":"fireRedCat","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint16","name":"_num","type":"uint16"},{"internalType":"address","name":"recipient","type":"address"}],"name":"getAirDrop","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxMint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxTotal","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"merkleRoot","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mintTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"porfit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"num","type":"uint256"},{"internalType":"bytes32[]","name":"proof_","type":"bytes32[]"}],"name":"preMint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"preMintOpen","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"price","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"num","type":"uint256"}],"name":"publicMint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"publicMintOpen","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"redCat","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_baseTokenURI","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"setBlindBoxOpened","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_blindTokenURI","type":"string"}],"name":"setBlindTokenURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_merkleRoot","type":"bytes32"}],"name":"setMerkleRoot","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"setMintPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_mintTime","type":"uint256"}],"name":"setMintTime","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_porfit","type":"uint256"}],"name":"setPorfit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"setPreMintOpen","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"setPublicMintOpen","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"setUseBlind","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_withdrawAddress","type":"address"}],"name":"setWithdrawAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"steven","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"useBlind","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32[]","name":"_merkleProof","type":"bytes32[]"}],"name":"verify","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"walletOfOwner","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawAll","outputs":[],"stateMutability":"nonpayable","type":"function"}]`}
          />
        </Form.Item>
        <Form.Item label="Reason">
          <Input.TextArea placeholder="This contract already exists on Dune. Contract resubmissions should be handled carefully and may get rejected." />
        </Form.Item>
        <Form.Item>
          <div>
            <Tooltip
              placement="left"
              title="Turn it on to automatically detect other contract instances with the same ABI."
            >
              <Checkbox defaultChecked>
                Are there several instances of this contract?
              </Checkbox>
            </Tooltip>
          </div>
          <div>
            <Tooltip
              placement="left"
              title="Turn it on to automatically decode all contracts created by the same address. Turn it off to decode all contracts with the same bytecode."
            >
              <Checkbox>Is it created by a factory contract?</Checkbox>
            </Tooltip>
          </div>
        </Form.Item>
        <Form.Item>
          <Button type="primary">Submit</Button>
        </Form.Item>
      </Form>
    );
  };

  return (
    <div className="SubmitContract">
      <div className="SubmitContract__add">
        <h1>Submit smart contracts for decoding</h1>
        <p>2 steps to add new contracts to Footprint</p>
        <Steps
          current={current}
          className="SubmitContract__steps"
          onChange={setCurrent}
        >
          <Steps.Step title="Contract Address" />
          <Steps.Step title="Contract Details" />
        </Steps>
        {current === 0 ? <ContractAddress /> : <ContractDetails />}
      </div>
    </div>
  );
};

export default SubmitContractAdd;
