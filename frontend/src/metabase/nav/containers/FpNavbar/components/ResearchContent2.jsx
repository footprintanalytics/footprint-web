/* eslint-disable react/prop-types */
/* eslint-disable react/forbid-component-props */
import React from "react";
import { ReactIcons } from "../utils/data";
import Icon from "../../../../components/Icon";
import Link from "../../../../core/components/Link";
import SimpleContent from "metabase/nav/containers/FpNavbar/components/SimpleContent";

const ResearchContent2 = props => {
  const data = [
    {
      title: "Games",
      data: [
        /*{
          title: "Top Telegram Mini Apps 🔥",
          desc: "Real-time updated Telegram mini apps rankings.",
          link: "/@Bond/Mini-App-Daily-Ranking",
          icon: ReactIcons.hotGamesIcon,
        },*/
        {
          title: "Top Games",
          desc: "Explore the exciting realm of blockchain games.",
          link: "/research/gamefi/game-rankings/top-games",
          icon: ReactIcons.topGameIcon,
        },
        {
          title: "Game Market",
          desc: "The latest summary of all on-chain GameFi data.",
          link: "/research/gamefi/game-overview/game-market",
          icon: ReactIcons.gameTokensIcon,
        },
        {
          title: "Chain Stats",
          desc: "Discover popular games across different blockchains.",
          link: "/research/gamefi/game-overview/chain-stats?series_date-79658=past90days~",
          icon: ReactIcons.hotGamesIcon,
        },
        {
          title: "Single Game Stats",
          desc: "In-depth stats of the game's transaction, token, NFT etc.",
          link: "/research/gamefi/game-protocols/single-game-stats",
          icon: ReactIcons.singleGameIcon,
        },
      ],
    },
    {
      title: "Chains",
      data: [
        {
          title: "Bitcoin Sidechains 🔥",
          desc: "Built on Bitcoin.",
          link: "/research/chain/chain-ecosystem/bitcoin-sidechains",
          icon: ReactIcons.layerIcon,
        },
        {
          title: "Cross Chain",
          desc: "Monitor and analyze data across multiple blockchains.",
          link: "/@Higi/Cross-Chain-Dashboard?series_date=past90days~#type=dashboard",
          icon: ReactIcons.crossChainIcon,
        },
        {
          title: "Chain Overview",
          desc: "Overview of blockchain ecosystem data.",
          link: "/research/chain/chain-ecosystem/chain-overview",
          icon: ReactIcons.chainOverviewIcon,
        },
        {
          title: "Single Chain Stats",
          desc: "Charts & statistics for a blockchain.",
          link: "/research/chain/evm-chain-stats/ethereum-overview?chain=Ethereum&series_date-85136=past90days~",
          icon: ReactIcons.singleGameIcon,
        },
      ],
    },
    {
      title: "DeFi",
      data: [
        {
          title: "Bitcoin Bridge Overview 🔥",
          desc: "Assess bridged BTC balance on BTC sidechains.",
          link: "/research/chain/chain-ecosystem/bitcoin-bridge-overview",
          icon: ReactIcons.gameTokensIcon,
        },
        {
          title: "Ethereum L2 Bridge Stats",
          desc: "Explore the major L2 solutions and their official bridge activities. ",
          link: "/research/chain/chain-ecosystem/layer-2-overview",
          icon: ReactIcons.topGameIcon,
        },
        {
          title: "DEX Metrics",
          desc: "Track trends in key DEX metrics.",
          link: "/research/defi/dex-overview/dex-metrics",
          icon: ReactIcons.gameMarketIcon,
        },
        {
          title: "DEX Protocol",
          desc: "Drill down to a specific dex and analyze it.",
          link: "/research/defi/single-protocol/dex-protocol",
          icon: ReactIcons.nftTradesIcon,
        },
      ],
    },
    {
      title: "Wallet",
      data: [
        {
          title: "Wallet Profile",
          desc: "Gain insights into the balance and activity of wallet.",
          link: "/research/wallet/wallet/ethereum-wallet-profile",
          icon: ReactIcons.balanceApiIcon,
        },
        {
          title: "Wallet Profit Leaderboard",
          desc: "Top wallets ranked by profitable performance on DEX.",
          link: "/@rogerD/Token-DEX-Profit-Leaderboard",
          icon: ReactIcons.hotGamesIcon,
        },
      ],
    },
    {
      title: "Tokens & NFTs",
      data: [
        {
          title: "Token Exchange Net Flow",
          desc: "Money flows transferred to and from exchange wallets to evaluate investors' behavior.",
          link: "/research/token/rankings/token-exchange-net-flow",
          icon: ReactIcons.gameTokensIcon,
        },
        {
          title: "Single Token",
          desc: "In-depth stats of the token's price data, exchange inflow and outflow, holder analysis and more.",
          link: "/research/token/token/single-token",
          icon: ReactIcons.nftTradesIcon,
        },
        {
          title: "Top NFT Marketplaces",
          desc: "High-value collections with key metrics",
          link: "/research/nft/nft-rankings/top-marketplaces",
          icon: ReactIcons.topGameIcon,
        },
        {
          title: "Top Collections",
          desc: "High-value collections with key metrics",
          link: "/research/nft/nft-rankings/top-collections",
          icon: ReactIcons.topMarketplacesIcon,
        },
      ],
    },
  ];

  const renderContent = tab => {
    return (
      <div className="main-menu__inner-layout-row">
        {data?.map(item => {
          return (
            <div className={"flex flex-column"} key={item.title}>
              <h3>{item.title}</h3>
              <div className="main-menu__line" />
              <SimpleContent menu={item?.data} />
            </div>
            )
        })}
      </div>
    );
  };

  return (
    <div className="main-menu__research-content">
      <div className="main-menu__inner">
        {renderContent()}
      </div>
    </div>
  );
};

export default ResearchContent2;
