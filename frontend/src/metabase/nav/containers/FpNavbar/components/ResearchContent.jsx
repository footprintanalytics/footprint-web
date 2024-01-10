/* eslint-disable react/prop-types */
/* eslint-disable react/forbid-component-props */
import React, { useState } from "react";
import { Button } from "antd";
import { ReactIcons } from "../utils/data";
import { getOssUrl } from "../../../../lib/image";
import { MainMenuFunction } from "../utils/function";
import Icon from "../../../../components/Icon";
import Link from "../../../../core/components/Link";

const ResearchContent = props => {
  const [select, setSelect] = useState("gamefi");

  const tabs = [
    {
      name: "GameFi",
      value: "gamefi",
      data: {
        rankingsData: {
          title: "RANKINGS", data: [
            {
              title: "Top Games",
              desc: "Explore the exciting realm of blockchain games.",
              link: "/research/gamefi/game-rankings/top-games",
              icon: ReactIcons.topGameIcon,
            },
            {
              title: "Game Tokens",
              desc: "Take informed decisions by game token's performence.",
              link: "/research/gamefi/game-rankings/game-tokens",
              icon: ReactIcons.gameTokensIcon,
            },
            {
              title: "Hot Games",
              desc: "Evaluate games from multiple views by gamers, NFTs, etc.",
              link: "/research/gamefi/game-rankings/hot-games-on-ethereum",
              icon: ReactIcons.hotGamesIcon,
            },
            {
              title: "In-Game NFT",
              desc: "Find out what's really hot with In-game NFT's activity.",
              link: "/research/gamefi/in-game-nft-rankings/top-in-game-nft-on-ethereum",
              icon: ReactIcons.inGameNFTIcon,
            },
          ],
        },
        industryData: {
          title: "Industry", data: [
            {
              title: "Game Market",
              desc: "The latest summary of all on-chain Gamefi data.",
              link: "/research/gamefi/game-overview/game-market",
              icon: ReactIcons.gameMarketIcon,
            },
            {
              title: "Chain Stats",
              desc: "Discover popular games across different blockchains.",
              link: "/research/gamefi/game-overview/chain-stats",
              icon: ReactIcons.chainStatsIcon,
            },
          ],
        },
        gameData: {
          title: "GAME", data: [
            {
              title: "Single Game",
              desc: "In-depth stats of the game's transaction, token, NFT etc.",
              link: "/research/gamefi/game-protocols/single-game-stats",
              icon: ReactIcons.singleGameIcon,
            },
          ],
        },
      },
    },
    {
      name: "NFT",
      value: "nft",
      data: {
        rankingsData: {
          title: "RANKINGS", data: [
            {
              title: "Top Collections",
              desc: "High-value collections with key metrics.",
              link: "/research/nft/nft-rankings/top-collections",
              icon: ReactIcons.topGameIcon,
            },
            {
              title: "Top Marketplaces",
              desc: "Stats and leaderboard of NFT marketplace.",
              link: "/research/nft/nft-rankings/top-marketplaces",
              icon: ReactIcons.topMarketplacesIcon,
            },
            {
              title: "Top Collections by Royalty",
              desc: "Find out the NFT collections with the highest royalty revenue.",
              link: "/research/nft/nft-rankings/top-collections-by-royalty",
              icon: ReactIcons.topCollectionsByRoyaltyIcon,
            },
          ],
        },
        signalsData: {
          title: "SIGNALS", data: [
            {
              title: "Trending",
              desc: "Tracking NFT collection hotness by sales.",
              link: "/research/nft/nft-signals/trending",
              icon: ReactIcons.trendingIcon,
            },
            {
              title: "Hot Mints",
              desc: "Hot collections minting now!",
              link: "/research/nft/nft-signals/hot-mints",
              icon: ReactIcons.hotGamesIcon,
            },
            {
              title: "Sweeps",
              desc: "Instant monitoring NFT sweeps.",
              link: "/research/nft/nft-signals/sweeps",
              icon: ReactIcons.sweepsIcon,
            },
            {
              title: "Top Sales",
              desc: "The most expensive NFTs recently sold.",
              link: "/research/nft/nft-signals/top-sales",
              icon: ReactIcons.topSalesIcon,
            },
          ],
        },
        industryData: {
          title: "INDUSTRY", data: [
            {
              title: "NFT Market",
              desc: "Overview of the whole NFT market data.",
              link: "/research/nft/nft-market/market-overview",
              icon: ReactIcons.gameMarketIcon,
            },
            {
              title: "Chains Stats",
              desc: "Discover popular NFT across different blockchains.",
              link: "/research/nft/nft-market/chains-stats",
              icon: ReactIcons.chainStatsIcon,
            },
          ],
        },
        collectionData: {
          title: "COLLECTION", data: [
            {
              title: "Single Collection",
              desc: "In-depth stats of the NFT's transaction, token, NFT etc.",
              link: "/research/nft/nft-collections/single-collection",
              icon: ReactIcons.singleGameIcon,
            },
          ],
        },
      },
    },
    {
      name: "Chain",
      value: "chain",
      data: {
        industryData: {
          title: "Industry", data: [
            {
              title: "Chain Overview",
              desc: "Overview of blockchain ecosystem data.",
              link: "/research/chain/chain-ecosystem/chain-overview",
              icon: ReactIcons.chainOverviewIcon,
            },
            {
              title: "Layer 2 Overview",
              desc: "Data stats of the Layer 2 ecosystem",
              link: "/research/chain/chain-ecosystem/layer-2-overview",
              icon: ReactIcons.topSalesIcon,
            },
          ],
        },
        layoutData: [
          {
            title: "Ethereum",
            img: getOssUrl("studio/img-chain-1.png"),
            link: "/research/chain/chain-stats/ethereum-overview",
          },
          {
            title: "BNB Chain",
            img: getOssUrl("studio/img-chain-2.png"),
            link: "/research/chain/chain-stats/bnb-chain-overview",
          },
          {
            title: "Avalanche",
            img: getOssUrl("studio/img-chain-3.png"),
            link: "/research/chain/chain-stats/avalanche-overview",
          },
          {
            title: "Harmony",
            img: getOssUrl("studio/img-chain-4.png"),
            link: "/research/chain/chain-stats/harmony-overview",
          },
          {
            title: "Fantom",
            img: getOssUrl("studio/img-chain-5.png"),
            link: "/research/chain/chain-stats/fantom-overview",
          },
          {
            title: "Cronos",
            img: getOssUrl("studio/img-chain-6.png?image_process=resize,w_36/crop,h_36/format,png"),
            link: "/research/chain/chain-stats/cronos-overview",
          },
          {
            title: "DFK",
            img: getOssUrl("studio/img-chain-11.png"),
            link: "/research/chain/chain-stats/dfk-overview",
          },
          {
            title: "Ronin",
            img: getOssUrl("studio/img-chain-12.png"),
            link: "/research/chain/chain-stats/ronin-overview",
          },
          {
            title: "Oasys",
            img: getOssUrl("studio/img-chain-13.png"),
            link: "/research/chain/chain-stats/oasys-overview",
          },
          {
            title: "Moonbeam",
            img: getOssUrl("studio/img-chain-14.png?1=1"),
            link: "/research/chain/chain-stats/moonbeam-overview",
          },
          {
            title: "Moonriver",
            img: getOssUrl("studio/img-chain-15.png?1=1"),
            link: "/research/chain/chain-stats/moonriver-overview",
          },
          {
            title: "Celo",
            img: getOssUrl("studio/img-chain-16.png"),
            link: "/research/chain/chain-stats/celo-overview",
          },
          {
            title: "ThunderCore",
            img: getOssUrl("studio/img-chain-17.png?image_process=resize,w_36/crop,h_36/format,png"),
            link: "/research/chain/chain-stats/thundercore-overview",
          },
          {
            title: "Sui",
            img: getOssUrl("studio/img-chain-27.png"),
            link: "/research/chain/chain-stats/sui-overview",
          },
          {
            title: "Polygon",
            img: getOssUrl("studio/img-chain-34.png"),
            link: "/research/chain/chain-stats/polygon-overview",
          },
          {
            title: "Nautilus",
            img: getOssUrl("fp-chains/nautilus.png?1=1&image_process=resize,w_36/crop,h_36/format,webp"),
            link: "/research/chain/chain-stats/nautilus-overview",
          },
        ],
        layout2Data: [
          {
            title: "zkSync Era",
            img: getOssUrl("studio/img-chain-31.png"),
            link: "/research/chain/chain-stats/zksync-era-overview",
          },
          {
            title: "Arbitrum",
            img: getOssUrl("studio/img-chain-32.png"),
            link: "/research/chain/chain-stats/arbitrum-overview",
          },
          {
            title: "Optimism",
            img: getOssUrl("studio/img-chain-33.png"),
            link: "/research/chain/chain-stats/optimism-overview",
          },
          {
            title: "HOME Verse",
            img: getOssUrl("studio/img-chain-35.png?image_process=resize,w_36/crop,h_36/format,png"),
            link: "/research/chain/chain-stats/home-verse-overview",
          },
          {
            title: "MCH Verse",
            img: getOssUrl("studio/img-chain-36.png"),
            link: "/research/chain/chain-stats/mch-verse-gamefi-overview",
          },
          {
            title: "TCG Verse",
            img: getOssUrl("studio/img-chain-37.png"),
            link: "/research/chain/chain-rankings/top-chains",
          },
          {
            title: "Starknet",
            img: getOssUrl("studio/img-chain-38.png"),
            link: "/research/chain/chain-stats/starknet-overview",
          },
          {
            title: "Boba",
            img: getOssUrl("studio/img-chain-24.png?1=1"),
            link: "/research/chain/chain-stats/boba-network-overview",
          },
          {
            title: "Rootstock",
            img: getOssUrl("fp-chains/rootstock.png?image_process=resize,w_36/crop,h_36/format,webp"),
            link: "/research/chain/chain-stats/rootstock-overview",
          },
          {
            title: "Combo",
            img: getOssUrl("fp-chains/combo.png?image_process=resize,w_36/crop,h_36/format,webp"),
            link: "/research/chain/chain-stats/combo-overview",
          },
        ],
        layout3Data: [
          {
            title: "Cosmos",
            img: getOssUrl("studio/img-chain-40.png"),
            link: "mailto:sales@footprint.network",
            target: "_blank",
          },
          {
            title: "Heco",
            img: getOssUrl("studio/img-chain-41.png"),
            link: "mailto:sales@footprint.network",
            target: "_blank",
          },
          {
            title: "Steem",
            img: getOssUrl("studio/img-chain-42.png"),
            link: "mailto:sales@footprint.network",
            target: "_blank",
          },
          {
            title: "Tron",
            img: getOssUrl("studio/img-chain-43.png"),
            link: "mailto:sales@footprint.network",
            target: "_blank",
          },
          {
            title: "HSC",
            img: getOssUrl("studio/img-chain-44.png"),
            link: "mailto:sales@footprint.network",
            target: "_blank",
          },
          {
            title: "Tcg Verse",
            img: getOssUrl("studio/img-chain-45.png"),
            link: "mailto:sales@footprint.network",
            target: "_blank",
          },
          {
            title: "Hive",
            img: getOssUrl("studio/img-chain-7.png"),
            link: "mailto:sales@footprint.network",
            target: "_blank",
          },
          {
            title: "Wax",
            img: getOssUrl("studio/img-chain-21.png"),
            link: "mailto:sales@footprint.network",
            target: "_blank",
          },
          {
            title: "IoTeX",
            img: getOssUrl("studio/img-chain-22.png"),
            link: "mailto:sales@footprint.network",
            target: "_blank",
          },
          {
            title: "EOS",
            img: getOssUrl("studio/img-chain-42.png"),
            link: "mailto:sales@footprint.network",
            target: "_blank",
          },
          {
            title: "Bitcoin",
            img: getOssUrl("studio/img-chain-25.png"),
            link: "mailto:sales@footprint.network",
            target: "_blank",
          },
          {
            title: "Doge",
            img: getOssUrl("studio/img-chain-26.png"),
            link: "mailto:sales@footprint.network",
            target: "_blank",
          },
        ],
        addData: {
          title: "Request a chain",
          desc: "Request a chain we don't currently \nsupport",
          link: "https://forms.gle/Z5ha1KYircHS7Pwi7",
          externalLink: true,
          layout: (
            <div className="main-menu__add-root">
              {ReactIcons.addIcon}
            </div>
          ),
        },
      },
    },
    {
      name: "Token",
      value: "token",
      data: {
        randingData: {
          title: "Rankings", data: [
            {
              title: "Top Tokens",
              desc: "Find potential growth tokens.",
              link: "/research/token/rankings/top-tokens-by-market-cap",
              icon: ReactIcons.topGameIcon,
            },
            {
              title: "Token Exchange Net Flow",
              desc: "Money flows transferred to and from exchange wallets to evaluate investors' behavior.",
              link: "/research/token/rankings/token-exchange-net-flow",
              icon: ReactIcons.gameMarketIcon,
            },
            /*{
              title: "Token Sectors",
              desc: "An index for each cryptocurrency category.",
              link: "/research/token/rankings/token-sectors-by-trading-volume",
              icon: ReactIcons.singleGameIcon,
            },*/
          ],
        },
        tokenData: {
          title: "Token", data: [
            {
              title: "Single Token",
              desc: "In-depth stats of the token's price data, exchange inflow and outflow, holder analysis and more.",
              link: "/research/token/token/single-token",
              icon: ReactIcons.nftTradesIcon,
            },
            /*{
              title: "Single Token Sector",
              desc: "Check out the token performance for each category.",
              link: "/research/token/token/single-token-sector",
              icon: ReactIcons.gameProfileIcon,
            },*/
          ],
        },
        stablecoinData: {
          title: "Stablecoin", data: [
            {
              title: "Stablecoin Master",
              desc: "A comprehensive analysis of stablecoins and their performance on exchanges.",
              link: "/research/token/stablecoin/stablecoin-master",
              icon: ReactIcons.nftTradesIcon,
            },
          ],
        },
        // walletDescData: {
        //   img: getOssUrl("studio/img-menu-wallet.png"),
        //   title: "Track and trace activities, holdings, and profiles over 100+ million addresses.",
        // },
      },
    },
    {
      name: "Wallet",
      value: "wallet",
      data: {
        walletData: {
          title: "WALLET", data: [
            {
              title: "Wallet Profile",
              desc: "Gain insights into the balance and activity of wallet.",
              link: "/research/wallet/wallet/wallet-profile",
              icon: ReactIcons.topGameIcon,
            },
          ],
        },
        walletTrackerData: {
          title: "WALLET TRACKER", data: [
            {
              title: "NFT Trades",
              desc: "Track the performance of NFT trades of a wallet.",
              link: "/research/wallet/wallet-tracker/nft-trades-of-wallet",
              icon: ReactIcons.nftTradesIcon,
            },
            {
              title: "Gamer Profile",
              desc: "Track GameFi, In-Game NFT, and all NFT analysis of a wallet.",
              link: "/research/wallet/wallet-tracker/gamer-profile-of-wallet",
              icon: ReactIcons.gameProfileIcon,
            },
            {
              title: "Money Flow",
              desc: "Track the inflow and outflow of a wallet at a specific time.",
              link: "/research/wallet/wallet-tracker/money-flow-of-wallet",
              icon: ReactIcons.moneyFlowIcon,
            },
          ],
        },
        // walletDescData: {
        //   img: getOssUrl("studio/img-menu-wallet.png"),
        //   title: "Track and trace activities, holdings, and profiles over 100+ million addresses.",
        // },
      },
    },
    {
      name: "Community",
      value: "community",
      link: "/dashboards",
    },
  ];

  const renderTabs = (data) => {
    return (
      <div className="main-menu__tabs">
        {data?.map(item => {
          return (
            <Button
              key={item.value}
              type={item.value === select ? "primary" : "text"}
              onClick={() => {
                if (item.value !== "community") {
                  setSelect(item.value);
                  return;
                }
                window.open(item.link);
              }}
            >
              {item.name}
              {item.link ? <Icon name="arrow_right_up" size={16} color="white"/> : null}
            </Button>
          );
        })}
      </div>
    );
  };

  const renderLink = (data) => {
    return (
      <div className="main-menu__more-layout">
        {data?.map(item => {
          const { url, title, hasAdd, hasArrow } = item;
          return (
            <Link to={url} key={title}>
              {hasAdd && (<div className="main-menu__more-layout-add-root"><span>+</span></div>)}
              {title}
              {hasArrow && (<Icon className="ml1" name="collapse_arrow_right" size={10} />)}
            </Link>
          )
        })}
      </div>
    )
  }

  const renderTabContent = tab => {
    const tabData = tabs.find(i => i.value === tab)?.data;
    if (tab === "gamefi") {
      return (
        <div className="main-menu__inner-layout">
          {MainMenuFunction.renderVerticalMenu({ data: tabData?.rankingsData })}
          {MainMenuFunction.renderVerticalMenu({ data: tabData?.industryData })}
          {MainMenuFunction.renderVerticalMenu({ data: tabData?.gameData })}
          {renderLink([{title: "Submit Contract", url: "/submit/contract/add", hasAdd: true, },{title: "More", url: "/research/gamefi", hasArrow: true }])}
        </div>
      );
    }
    if (tab === "nft") {
      return (
        <div className="main-menu__inner-layout">
          {MainMenuFunction.renderVerticalMenu({ data: tabData?.rankingsData })}
          {MainMenuFunction.renderVerticalMenu({ data: tabData?.signalsData })}
          {MainMenuFunction.renderVerticalMenu({ data: tabData?.industryData })}
          {MainMenuFunction.renderVerticalMenu({
            data: tabData?.collectionData,
            title: "COLLECTION",
          })}
          {renderLink([{title: "Submit Contract", url: "/submit/contract/add", hasAdd: true, },{title: "More", url: "/research/nft", hasArrow: true}])}
        </div>
      );
    }
    if (tab === "chain") {
      return (
        <div className="main-menu__inner-layout">
          {MainMenuFunction.renderVerticalMenu({ data: tabData?.industryData })}
          <div className="main-menu__inner-chain-layout">
            {MainMenuFunction.renderChainLayout({ data: tabData?.layoutData, title: "PUBLIC CHAIN" })}
            <div className="flex">
              {MainMenuFunction.renderChainLayout({ data: tabData?.layout2Data, title: "LAYER2" })}
              {MainMenuFunction.renderStandardShow({ data: tabData?.addData, className: "ml2" })}
            </div>
            {MainMenuFunction.renderChainLayout({ data: tabData?.layout3Data, title: "CONTACT SALES" })}
          </div>
        </div>
      );
    }
    if (tab === "token") {
      return (
        <div className="main-menu__inner-layout">
          {MainMenuFunction.renderVerticalMenu({ data: tabData?.randingData })}
          {MainMenuFunction.renderVerticalMenu({ data: tabData?.tokenData })}
          {MainMenuFunction.renderVerticalMenu({ data: tabData?.stablecoinData })}
        </div>
      );
    }
    if (tab === "wallet") {
      return (
        <div className="main-menu__inner-layout">
          {MainMenuFunction.renderVerticalMenu({ data: tabData?.walletData })}
          {MainMenuFunction.renderVerticalMenu({ data: tabData?.walletTrackerData })}
        </div>
      );
    }
  };

  return (
    <div className="main-menu__research-content">
      {renderTabs(tabs)}
      <div className="main-menu__line" />
      <div className="main-menu__inner">
        {renderTabContent(select)}
      </div>
    </div>
  );
};

export default ResearchContent;
