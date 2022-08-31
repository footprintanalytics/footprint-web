/* eslint-disable curly */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Image, message, Skeleton, Spin } from "antd";
import AboutSocial from "metabase/containers/about/components/AboutSocial";
import { trackStructEvent } from "metabase/lib/analytics";
import ABI from "./ABI.json";
import MintModal from "./MintModal";
import { contractAddress, network } from "./config";

const NftStart = ({
  user,
  setLoginModalShow,
  setShowModal,
  data,
  isLoading,
}) => {
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const isAllowed = data?.isAllowed;
  const userIdIsExist = data?.userIdIsExist;

  const scrollToAnchor = anchorName => {
    if (anchorName) {
      const anchorElement = document.getElementById(anchorName);
      if (anchorElement) {
        anchorElement.scrollIntoView({ block: "end", behavior: "smooth" });
      }
    }
  };

  const getTokens = async (account, contract) => {
    return contract.methods.tokensOfOwner(account).call();
  };

  const mint = async () => {
    setLoading(true);

    const wallet = await connectWallet();
    if (!wallet) {
      setLoading(false);
      return;
    }

    const { account, contract } = wallet;
    if (account.toLowerCase() !== data?.userAddress.toLowerCase()) {
      message.error("Please use the wallet address you submitted to mint");
      setLoading(false);
      return;
    }

    const tokens = await getTokens(account, contract);
    if (tokens.length) {
      setToken(tokens[0]);
      setVisible(true);
      setLoading(false);
      return;
    }

    try {
      await contract.methods
        .mintNFTs(1, data.hash, data.signature)
        .send({ from: account });
      const tokens = await getTokens(account, contract);
      if (tokens.length) {
        setToken(tokens[0]);
        setVisible(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const renderButton = () => {
    if (isLoading) {
      return (
        <div className="nft-activity__skeleton">
          <Skeleton active />
        </div>
      );
    }
    if (!user) {
      return (
        <div
          className="nft-activity__btn"
          onClick={() => {
            trackStructEvent("moon-men click register");
            setLoginModalShow({ show: true, from: "nft-activity" });
          }}
        >
          Sign up
        </div>
      );
    }
    if (!userIdIsExist) {
      return (
        <div
          className="nft-activity__btn"
          onClick={() => {
            trackStructEvent("moon-men click Submit info");
            setShowModal(true);
          }}
        >
          Submit your information to win NFT
        </div>
      );
    }
    if (isAllowed && data?.hash && data?.signature) {
      return (
        <div
          className={`nft-activity__btn ${
            loading ? "nft-activity__btn--disabled" : ""
          }`}
          onClick={() => {
            trackStructEvent("moon-men click Mint NFT");
            if (!loading) mint();
          }}
        >
          {loading ? <Spin /> : null}
          Mint NFT{loading ? "..." : ""}
        </div>
      );
    }
    if (userIdIsExist) {
      return (
        <div
          className="nft-activity__btn"
          onClick={() => {
            trackStructEvent("moon-men click Earn points");
            scrollToAnchor("nft-activity__how");
          }}
        >
          Earn points to win NFT
        </div>
      );
    }
    return <div />;
  };

  return (
    <>
      <div className="nft-activity__start">
        <div className="nft-activity__wrap">
          <h1>Moon Men</h1>
          <h2>{"Footprint Analytics NFT is coming! "}</h2>
          <AboutSocial size={20} />
          <span className="nft-activity__start-desc">
            Create your account and <br />
            get a chance to mint NFT!
            <span
              className="text-underline cursor-pointer ml2"
              onClick={() => {
                trackStructEvent("moon-men click arrow-arrow");
                scrollToAnchor("nft-activity__how");
              }}
            >
              {">>"}
            </span>
          </span>
          {renderButton()}
        </div>
        <Image
          placeholder={<Skeleton active />}
          preview={false}
          src={"https://static.footprint.network/img_nft_icon_2022081902.png?2"}
        />
      </div>
      <MintModal
        token={token}
        visible={visible}
        onCancel={() => setVisible(false)}
      />
    </>
  );
};

const connectWallet = async () => {
  try {
    const Web3 = (await import("web3")).default;
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: Web3.utils.toHex(network === "mainnet" ? 1 : 4) }],
    });
    const Web3Modal = (await import("web3modal")).default;
    const web3Modal = new Web3Modal({
      network,
      cacheProvider: true,
      providerOptions: {
        walletconnect: {
          package: (await import("@walletconnect/web3-provider")).default,
          options: {
            rpc: `https://${network}.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`,
          },
        },
      },
    });
    const provider = await web3Modal.connect();
    await provider.enable();
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(ABI, contractAddress);
    return { account: accounts[0], contract };
  } catch (error) {
    console.log(error);
  }
};

export default NftStart;
