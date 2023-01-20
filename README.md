# Footprint Web APP

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

## Get started

Guide for the Footprint web application accessible from www.footprint.network

* Footprint lets users convert raw data tables into charts without any code with an easy-to-use drag-and-drop interface.
* Anyone to get started with blockchain analytics quickly; Footprint provides thousands of datasets that encourage curiosity, creativity and data-driven decision making.
* Users can find the dashboard they need based on topic, chain, or category of data. Footprint supports forking any open analytics table on the platform with one click, helping users create and manage personalised dashboards easily.
* Quickly replicate and find new inspiration with hundreds of community-created dashboards.

### No coding required

Footprint makes exploring blockchain data simple with its drag-and-drop user experience. No need for SQL queries or coding to explore blockchain data—anyone can discover and present actionable DeFi insights.

### Storytelling with data

Our solution lets you analyse the market and present your findings, no matter what your audience's experience with blockchain. There are more than types of charts to choose from. Fork charts with one click. Footprint provides rich data analytics templates that support forks with any open analytics table on the platform with one click, helping you easily create and manage your personalised dashboards. You can also share your data tables and dashboards with your partners or social channels.



## Features
* Tables

footprint table involves gamefi defi nft and other multi-domain table, you can search for the corresponding table to do table analysis data.

![footprint web table](https://static.footprint.network/github/footprint-web-table.png)
* [Charts](https://docs.footprint.network/docs/charts)

We can use drag and drop mode or sql mode to quickly create a chart. For non-technical people it is possible to create charts to analyze data without writing code. So cool.

![footprint web chart](https://static.footprint.network/github/footprint-web-chart.png)
* [Visualisations](https://docs.footprint.network/docs/visualisations)

A variety of chart types to choose from, such as line, bar, pie, area, etc. Displaying data is more intuitive and more beautiful.

![footprint web visualisation](https://static.footprint.network/github/footprint-web-visualisation.png)
* [Dashboards](https://docs.footprint.network/docs/create)

Different charts can be added to the dashboad, arranging their position and size in order to better display the data. Filtering conditions are also supported. Dashboard can be embedded into other websites.

![footprint web dashboard](https://static.footprint.network/github/footprint-web-dashboard.png)


## Architecture
- Frontend - react
- Backend - clojure

## Building and Running the application

### Backend

To complete any build of the footprint web code, you’ll need to install the following.

[Clojure](https://clojure.org) - install the latest release by following the guide depending on your OS

[Java Development Kit JDK](https://adoptopenjdk.net/releases.html) - you need to install JDK 11 (more info on Java versions)

[Node.js](http://nodejs.org/) - latest LTS release

[Yarn package manager for Node.js](https://yarnpkg.com/) - latest release of version 1.x - you can install it in any OS by running:

```
npm install --global yarn
``` 
    
On a most recent stable Ubuntu/Debian, all the tools above, with the exception of Clojure, can be installed by using:

```
sudo apt install openjdk-11-jdk nodejs && sudo npm install --global yarn
``` 
    
If you have multiple JDK versions installed in your machine, be sure to switch your JDK before building with:

```
sudo update-alternatives --config java
```    
    
Then select Java 11 in the menu.

Start the backend build process with

```
clj -X:deps prep
```

Run your backend development server with

```
clojure -M:run
```

### Frontend

Compile javascript dependencies

```
$ yarn
```

Start the frontend build process with

```
yarn build-hot
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

