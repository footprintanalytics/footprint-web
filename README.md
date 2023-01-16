<div align="center">
  <div align=center><img src="https://files.readme.io/be7e289-_2.png" width=" 476 "></div>
  <h2 align="center">
    Blockchain analytics made simple
  </h2>
  <p>Explore community-built analysis and create charts with no code required.</p>
  <br />
 <a href="https://www.footprint.network/">Website</a>｜
 <a href="https://docs.footprint.network/docs">Docs</a>｜
 <a href="https://www.footprint.network/data-api">Data API</a>｜
 <a href="https://www.footprint.network/news/academy">Web3 Data Academy </a>
  <p>
    <br />
    <a href="https://twitter.com/Footprint_Data"><img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/Footprint_Data?label=Follow"></a>
    <a href="https://discord.gg/3HYaR6USM7"><img src="https://img.shields.io/discord/864829036294307881?color=5865F2&logo=discord&logoColor=white&label=discord" alt="Discord server" /></a>
    <a href="https://t.me/joinchat/4-ocuURAr2thODFh"><img src="https://img.shields.io/badge/telegram-blue?color=blue&logo=telegram&logoColor=white" alt="Telegram group" /></a>
    <a href="https://www.youtube.com/c/FootprintAnalytics"><img alt="YouTube Channel Subscribers" src="https://img.shields.io/youtube/channel/subscribers/UCKwZbKyuhWveetGhZcNtSTg?style=social"></a>
  </p>
</div>

## Introduce
Footprint Analytics is building blockchain's most comprehensive data infrastructure with tools to help developers, analysts, and investors get unrivaled real-time GameFi, DeFi, and NFT insights.
The engine indexes, cleans and abstracts data from 24+ chains and counting — letting users build charts and dashboards without code using a drag-and-drop interface as well as with SQL. [Explore Web3 data](https://www.footprint.network/dashboards)
Footprint Analytics also provides a unified data API for NFTs, GameFi, and DeFi across all major chain ecosystems to build your applications fast.

![footprint market snapshot](https://static.footprint.network/github/footprint_website.png)

## Footprint Web Application
Footprint web application is built on Metabase open-source technology. We use Metabase because it is open — the technology allows users to contribute to the code base, developing and improving it over time.
Analysts can create charts on the Footprint Analytics platform with a convenient drag-and-drop query builder. This capability significantly lowers the barrier to entry, allowing any user without technical knowledge to use the product and extract business value.

> ### Features
> - [No code SQL](https://docs.footprint.network/docs/no-code)
> - [Rich visualization charts](https://docs.footprint.network/docs/line-chart)
> - [Alerts](https://docs.footprint.network/docs/alerts)

![footprint snapshot](https://static.footprint.network/github/footprint_web_readme.png)

## Footprint Data API
The UI is not the only interface that could be used to access the data. Footprint provides a unified Data API for developers to build applications. Both REST API and SQL API are supported at Footprint Analytics.

![footprint API snapshot](https://static.footprint.network/github/footprint_api_readme.png)


## Footprint Data
As of Jan 2023, we parse more data from 24 different chains than any other platforms. The Footprint Analytics database automatically picks up blocks, logs, traces, and transactions on the blockchain. It supplements this with community-contributed data and data from 3rd party APIs (e.g. token price data from Coingecko.) All this data is originally raw and unstructured. We structure it to fit into categories, e.g. borrowing, lending, yield farming, etc. This way, any data from the blockchain is easily accessible by anyone.

Our core competitive advantage is our Footprint Analytics Platform, powered by the Footprint Machine Learning Platform. It turns the Bronze Data into Silver, then Gold using some technical means of data ETL, such as Python and SQL. In the future, we plan to make the ETL code, including the code from Bronze to Silver parsing, open source.

We also enable any organization to tap into this trove of structured data with our blockchain data API.

![Footprint Data snapshot](https://files.readme.io/2ab5caf-Screenshot_2022-10-27_at_08.35.37.png)

Whereas other popular solutions need to recompute high level indicators every time from raw event data, in Footprint with the data layers abstraction layers (silver and gold), the amount of work is significantly reduced to query key information. Ultimately, user requests are completed in milliseconds, where similar requests can take minutes on other platforms.

With the sophisticated architecture in the background come the caching mechanisms that greatly reduce redundant work and computing resource from O(n) to O(1). Dataset previously queried will be saved in cache and will be used during the next query execution. That way, users get their requests fast and our network don’t experience overloads so other users are not affected.

![Footprint Data snapshot](https://files.readme.io/27f1034-d411037b-7258-436c-b696-5bc7c10e8e13.jpg)
## License
[AGPL](https://opensource.org/licenses/AGPL-3.0)
