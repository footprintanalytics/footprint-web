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
          title: "Chain Overview",
          desc: "Overview of blockchain ecosystem data.",
          link: "/research/chain/chain-ecosystem/chain-overview",
          icon: ReactIcons.chainOverviewIcon,
        },
        {
          title: "Layer 2 Overview",
          desc: "Data stats of the Layer 2 ecosystem.",
          link: "/research/chain/chain-ecosystem/layer-2-overview",
          icon: ReactIcons.layerIcon,
        },
        {
          title: "Cross Chain",
          link: "/@Higi/Cross-Chain-Dashboard?series_date=past90days~#type=dashboard",
          icon: ReactIcons.crossChainIcon,
        },
        {
          title: "Single Chain Stats",
          link: "/research/chain/chain-stats/ethereum-overview?chain=Ethereum&series_date-85136=past90days~",
          icon: ReactIcons.singleGameIcon,
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
          link: "/@rogerD/Token-DEX-Profit-Leaderboard",
          icon: ReactIcons.hotGamesIcon,
        },
      ],
    },
    {
      title: "Tokens",
      data: [
        {
          title: "Token Exchange Net Flow",
          desc: "Money flows transferred to and from exchange wallets to evaluate investors' behavior.",
          link: "/research/token/rankings/token-exchange-net-flow",
          icon: ReactIcons.gameTokensIcon,
        },
        {
          title: "Top Tokens Traded on DEX",
          link: "/research/token/rankings/top-tokens-traded-on-dex?past_days=1",
          icon: ReactIcons.topGameIcon,
        },
        {
          title: "Single Token",
          desc: "In-depth stats of the token's price data, exchange inflow and outflow, holder analysis and more.",
          link: "/research/token/token/single-token",
          icon: ReactIcons.nftTradesIcon,
        },
      ],
    },
    {
      title: "NFTs",
      data: [
        {
          title: "Top Collections",
          desc: "High-value collections with key metrics",
          link: "/research/nft/nft-rankings/top-collections",
          icon: ReactIcons.topGameIcon,
        },
        {
          title: "NFT Market",
          desc: "Overview of the whole NFT market data",
          link: "/research/nft/nft-market/market-overview",
          icon: ReactIcons.gameMarketIcon,
        },
        {
          title: "Top Marketplaces",
          desc: "Stats and leaderboard of NFT Marketplace.",
          link: "/research/nft/nft-rankings/top-marketplaces?date=past30days~",
          icon: ReactIcons.topMarketplacesIcon,
        },
        {
          title: "Single Collection",
          desc: "In-depth stats of the NFT's transaction, token, NFT etc.",
          link: "/research/nft/nft-collections/single-collection",
          icon: ReactIcons.topCollectionsByRoyaltyIcon,
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
