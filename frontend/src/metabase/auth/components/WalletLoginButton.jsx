/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { connect } from "react-redux";
import AuthProviderButton from "metabase/auth/components/AuthProviderButton";
import { loginWallet } from "metabase/auth/auth";
import { getChannel } from "metabase/selectors/app";
import { message } from "antd";
import {
  WalletAddressNonce,
  WalletAddressNonceCheck,
} from "metabase/new-service";
import BindUserWithWalletAddressModal from "./BindUserWithWalletAddressModal";
import { getErrorMessage } from "metabase/components/form/FormMessage";

const mapStateToProps = (state, props) => {
  return {
    channel: getChannel(state, props),
  };
};

@connect(mapStateToProps, { loginWallet })
export default class WalletLoginButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null,
      addressStr: null,
      nonceDataStr: null,
      signResultStr: null,
    };
  }

  hideMessage = null;
  updateMessage = (messageStr, isLoading = false) => {
    this.hideMessage && this.hideMessage();
    if (messageStr) {
      if (isLoading) {
        this.hideMessage = message.loading(messageStr, 0);
      } else {
        this.hideMessage = message.info(messageStr);
      }
    }
  };

  subscribeProvider(provider) {
    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts: string[]) => {});
    // Subscribe to chainId change
    provider.on("chainChanged", (chainId: number) => {});
    // Subscribe to provider connection
    provider.on("connect", (info: { chainId: number }) => {});
    // Subscribe to provider disconnection
    provider.on("disconnect", (error: { code: number, message: string }) => {});
  }

  connectWallet = async () => {
    this.setState({
      ...this.state,
      errorMessage: "",
    });
    this.updateMessage("Connecting to your wallet...", true);
    try {
      const Web3 = (await import("web3")).default;
      const Web3Modal = (await import("web3modal")).default;
      const WalletConnectProvider = (
        await import("@walletconnect/web3-provider")
      ).default;
      const we3parms = {
        network: "mainnet", // optional
        cacheProvider: false, // optional
        providerOptions: {
          walletconnect: {
            package: WalletConnectProvider, // required
            options: {
              infuraId: "", // required
              rpc:
                "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
            },
          }, // required
        },
      };
      const web3Modal = new Web3Modal(we3parms);
      web3Modal.clearCachedProvider();
      const provider = await web3Modal.connect();
      this.subscribeProvider(provider);
      await provider.enable();
      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      // const networkId = await web3.eth.net.getId();
      // const chainId = await web3.eth.getChainId();
      console.log("wallet", "address = " + address);
      const { msg, nonce } = await WalletAddressNonce({ address: address });
      // this.updateMessage();
      // this.signMessage(web3, msg, nonce);

      this.updateMessage("Verifying your address...", true);
      const signResult = await web3.eth.personal.sign(
        web3.utils.utf8ToHex(msg),
        address,
      );
      this.setState({
        ...this.state,
        addressStr: address,
        nonceDataStr: nonce,
        signResultStr: signResult,
      });
      this.updateMessage();
      this.signCheck(address, msg, nonce, signResult);
    } catch (error) {
      this.setState({ errorMessage: error.message ? error.message : error });
      this.updateMessage(error.message ? error.message : error);
    }
  };

  signCheck = async (address, msg, nonce, signResult) => {
    this.updateMessage("Confirming with server...", true);
    try {
      const result = await WalletAddressNonceCheck({
        address: address,
        nonce: nonce,
        sign: signResult,
      });
      if (result.result) {
        if (result.isBindUser) {
          //goto login
          setTimeout(() => {
            this.userLoginOrBind();
          });
        } else {
          //show bind user modal
          this.setState({ ...this.state, showBindUser: true });
        }
      } else {
        this.setState({
          ...this.state,
          errorMessage: "Your address has verify fail! Please try again!",
        });
      }
    } catch (e) {
      this.setState({ ...this.state, errorMessage: getErrorMessage(e) });
    }
    this.updateMessage();
  };

  userLoginOrBind = async (email, password) => {
    const { addressStr, signResultStr, nonceDataStr } = this.state;
    if (!addressStr || !signResultStr) {
      this.setState({
        ...this.state,
        errorMessage: "Please sign with your wallet first!",
      });
      return;
    }
    this.updateMessage("Login into server...", true);

    let loginParam = {
      address: addressStr,
      nonce: nonceDataStr,
      sign: signResultStr,
    };
    if (this.props.channel) {
      loginParam = { ...loginParam, channel: this.props.channel };
    }
    if (email && password) {
      loginParam = { ...loginParam, username: email, password: password };
    }
    try {
      const { payload } = await this.props.loginWallet(
        loginParam,
        location.query ? location.query.redirect : location,
      );
      if (payload.error) {
        this.setState({ errorMessage: payload.error });
        this.updateMessage();
      } else {
        this.updateMessage("Login Success!");
        this.setState({ ...this.state, showBindUser: false });
      }
    } catch (error) {
      this.updateMessage();
      this.setState({ errorMessage: error.message ? error.message : error });
    }
  };

  render() {
    const { errorMessage, showBindUser = false } = this.state;
    const { className, buttonText } = this.props;
    return (
      <div>
        <AuthProviderButton
          provider="eth"
          onClick={this.connectWallet}
          className={className}
          buttonText={buttonText}
        />
        {errorMessage && (
          <div
            className="bg-error p1 rounded text-white text-bold mt3"
            style={{ textAlign: "center" }}
          >
            {errorMessage}
          </div>
        )}
        {showBindUser && (
          <BindUserWithWalletAddressModal
            visible={showBindUser}
            errorMessage={errorMessage ? errorMessage : ""}
            onSubmit={async credentials => {
              this.userLoginOrBind(credentials.Email, credentials.Password);
            }}
            onClose={() => {
              this.setState({ ...this.state, showBindUser: false });
              this.userLoginOrBind();
            }}
          />
        )}
      </div>
    );
  }
}
