/* eslint-disable react/prop-types */
import React from "react";
import { Modal } from "antd";
import "./MintModal.css";
import { contractAddress, network } from "./config";

const MintModal = ({ visible, onCancel, token }) => {
  return (
    <Modal
      wrapClassName="MintModal"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      maskClosable={false}
      width={640}
      style={{ top: "30%" }}
    >
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M40 0C17.9075 0 0 17.908 0 40C0 62.0911 17.9075 80 40 80C62.0911 80 80 62.0911 80 40C80 17.908 62.0915 0 40 0V0ZM39.7137 74.7925C20.2608 74.7925 4.49179 59.0226 4.49179 39.5696C4.49179 20.1171 20.2608 4.34769 39.7137 4.34769C59.1672 4.34769 74.9361 20.1171 74.9361 39.5696C74.9361 59.0226 59.1672 74.7925 39.7137 74.7925V74.7925Z"
          fill="#49FFFE"
        />
        <path
          d="M39.959 39.9513V40.0477L40.0406 40L39.959 39.9513Z"
          fill="#49FFFE"
        />
        <path
          d="M39.8789 40.1369L40.1199 40L39.8789 39.8625V40.1369Z"
          fill="#49FFFE"
        />
        <path
          d="M64.4579 24.1399C63.9677 23.6505 63.3034 23.3757 62.6107 23.3757C61.918 23.3757 61.2537 23.6505 60.7635 24.1399L34.0117 50.7003L19.2318 35.9257C18.7419 35.4368 18.0781 35.1623 17.386 35.1623C16.6939 35.1623 16.0301 35.4368 15.5402 35.9257C15.2977 36.1681 15.1054 36.456 14.9742 36.7727C14.8429 37.0895 14.7754 37.4291 14.7754 37.772C14.7754 38.1149 14.8429 38.4544 14.9742 38.7712C15.1054 39.088 15.2977 39.3758 15.5402 39.6183L31.7839 55.8596C32.0251 56.1028 32.3122 56.2958 32.6285 56.4273C32.9448 56.5589 33.2841 56.6264 33.6266 56.6259C33.7545 56.6259 33.8814 56.612 34.0122 56.6011C34.1338 56.6201 34.2646 56.6259 34.3934 56.6259C34.7362 56.6264 35.0757 56.559 35.3922 56.4275C35.7088 56.2959 35.9961 56.1029 36.2375 55.8596L64.4541 27.8348C64.6977 27.5928 64.891 27.3051 65.0231 26.9882C65.1551 26.6713 65.2233 26.3315 65.2236 25.9881C65.224 25.6448 65.1565 25.3048 65.0251 24.9876C64.8937 24.6705 64.701 24.3824 64.4579 24.1399Z"
          fill="#49FFFE"
        />
      </svg>
      <h3>Congratulations!</h3>
      <p>
        Your NFT has been minted successfully!
        <br />
        Check and refresh your wallet as it might not appear immediately!
      </p>
      <div className="MintModal__btns">
        <a
          href={
            network === "mainnet"
              ? `https://opensea.io/assets/ethereum/${contractAddress}/${token}`
              : `https://testnets.opensea.io/assets/rinkeby/${contractAddress}/${token}`
          }
          target="_blank"
          rel="noreferrer"
        >
          See your Mint
        </a>
        <a
          href={
            network === "mainnet"
              ? `https://etherscan.io/address/${contractAddress}`
              : `https://rinkeby.etherscan.io/address/${contractAddress}`
          }
          target="_blank"
          rel="noreferrer"
        >
          View on Etherscan
        </a>
      </div>
    </Modal>
  );
};

export default MintModal;
