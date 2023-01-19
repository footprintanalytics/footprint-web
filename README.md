# Footprint Web
Footprint Web is a website where you can create charts and dashboards for analyzing data without code.

![footprint web](https://static.footprint.network/github/footprint-web-index.png)

<div align="center">
    <p>
    <br />
    <a href="https://twitter.com/Footprint_Data"><img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/Footprint_Data?label=Follow"></a>
    <a href="https://discord.gg/3HYaR6USM7"><img src="https://img.shields.io/discord/864829036294307881?color=5865F2&logo=discord&logoColor=white&label=discord" alt="Discord server" /></a>
    <a href="https://t.me/joinchat/4-ocuURAr2thODFh"><img src="https://img.shields.io/badge/telegram-blue?color=blue&logo=telegram&logoColor=white" alt="Telegram group" /></a>
    <a href="https://www.youtube.com/c/FootprintAnalytics"><img alt="YouTube Channel Subscribers" src="https://img.shields.io/youtube/channel/subscribers/UCKwZbKyuhWveetGhZcNtSTg?style=social"></a>
  </p>
</div>

## Features
* Tables

footprint table involves gamefi defi nft and other multi-domain table, you can search for the corresponding table to do table analysis data.

![footprint web table](https://static.footprint.network/github/footprint-web-table.png)
* Charts

We can use drag and drop mode or sql mode to quickly create a chart. For non-technical people it is possible to create charts to analyze data without writing code. So cool.

![footprint web chart](https://static.footprint.network/github/footprint-web-chart.png)
* Visualisations

A variety of chart types to choose from, such as line, bar, pie, area, etc. Displaying data is more intuitive and more beautiful.

![footprint web visualisation](https://static.footprint.network/github/footprint-web-visualisation.png)
* Dashboards

Different charts can be added to the dashboad, arranging their position and size in order to better display the data. Filtering conditions are also supported. Dashboard can be embedded into other websites.

![footprint web dashboard](https://static.footprint.network/github/footprint-web-dashboard.png)


## Architecture
- Frontend - react
- Backend - clojure

## Building and Running the application

#### Frontend

Compile javascript dependencies

```
$ yarn
```

Start the frontend build process with

```
yarn build-hot
```

#### Backend

Start the backend build process with

```
clj -X:deps prep
```

Run your backend development server with

```
clojure -M:run
```

## Contributing

#### How to contribute back to the Footprint Web project

##### A) Identify product needs from the community

We actively look for new feature ideas from our community and user base. We concentrate on the underlying problem or need as opposed to requests for specific features. While sometimes suggested features are built as requested, often we find that they involve changes to existing features, and perhaps an entirely different solution to the underlying problem. These will typically be collected in a number of issues, and tagged Proposal

##### B) Verification and merging

All PRs that involve more than an insignificant change should be reviewed.

If all goes well, the feature gets coded up, verified and then the pull request gets merged.

If there are tests missing, code style concerns or specific architectural issues in the pull request, they should be fixed before merging. We have a very high bar on both code and product quality and it’s important that this be maintained going forward, so please be patient with us here.

## License

This repository contains the source code for both the Open Source edition of Metabase, released under the AGPL, as well as the [commercial editions of Metabase](https://www.metabase.com/pricing), which are released under the Metabase Commercial Software License.

See [LICENSE.txt](./LICENSE.txt) for details.

Unless otherwise noted, all files © 2022 Metabase, Inc.

