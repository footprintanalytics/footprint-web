const demoAllData = {
  "nodes": [
    {
      "name": "open_app",
      "value": 20,
      "id": "open_app_1"
    },
    {
      "name": "login",
      "value": 19,
      "id": "login_1"
    },
    {
      "name": "play_games",
      "value": 10,
      "id": "play_games_1"
    },
    {
      "name": "purchase",
      "value": 8,
      "id": "purchase_1"
    },
    {
      "name": "nft_reward",
      "value": 4,
      "id": "nft_reward_1"
    },
    {
      "name": "close_app",
      "value": 8,
      "id": "close_app_1"
    },
    {
      "name": "purchase",
      "value": 4,
      "id": "purchase_2"
    },
    {
      "name": "close_app",
      "value": 3,
      "id": "close_app_2"
    },
    {
      "name": "close_app",
      "value": 4,
      "id": "close_app_3"
    },
    {
      "name": "close_app",
      "value": 1,
      "id": "close_app_4"
    },
  ],
  "links": [
    {
      "source": "open_app_1",
      "target": "login_1",
      "value": 19
    },
    {
      "source": "login_1",
      "target": "play_games_1",
      "value": 12
    },
    {
      "source": "play_games_1",
      "target": "purchase_1",
      "value": 4
    },
    {
      "source": "purchase_1",
      "target": "nft_reward_1",
      "value": 4
    },
    {
      "source": "nft_reward_1",
      "target": "close_app_1",
      "value": 4
    },
    {
      "source": "play_games_1",
      "target": "close_app_3",
      "value": 4
    },
    {
      "source": "login_1",
      "target": "purchase_2",
      "value": 4
    },
    {
      "source": "purchase_2",
      "target": "close_app_2",
      "value": 3
    },
    {
      "source": "purchase_1",
      "target": "close_app_1",
      "value": 4
    },
    {
      "source": "login_1",
      "target": "close_app_4",
      "value": 1
    },
  ]
}

const demoViewData = {
  "nodes": [
    {
      "name": "login",
      "value": 19,
      "id": "login_1"
    },
    {
      "name": "play_games",
      "value": 10,
      "id": "play_games_1"
    },
    {
      "name": "close_app",
      "value": 4,
      "id": "close_app_3"
    },
    {
      "name": "close_app",
      "value": 1,
      "id": "close_app_4"
    },
  ],
  "links": [
    {
      "source": "login_1",
      "target": "play_games_1",
      "value": 12
    },
    {
      "source": "play_games_1",
      "target": "close_app_3",
      "value": 4
    },
    {
      "source": "login_1",
      "target": "close_app_4",
      "value": 1
    },
  ]
}

const demoData = {
  "nodes": [
    {
      "name": "play_games",
      "value": 5,
      "id": "play_games_3"
    },
    {
      "name": "login",
      "value": 16,
      "id": "login_1"
    },
    {
      "name": "nft_reward",
      "value": 1,
      "id": "nft_reward_6"
    },
    {
      "name": "play_games",
      "value": 6,
      "id": "play_games_4"
    },
    {
      "name": "play_games",
      "value": 9,
      "id": "play_games_2"
    },
    {
      "name": "purchase",
      "value": 2,
      "id": "purchase_4"
    },
    {
      "name": "purchase",
      "value": 4,
      "id": "purchase_5"
    },
    {
      "name": "login",
      "value": 5,
      "id": "login_2"
    },
    {
      "name": "nft_reward",
      "value": 1,
      "id": "nft_reward_5"
    },
    {
      "name": "purchase",
      "value": 2,
      "id": "purchase_2"
    },
    {
      "name": "purchase",
      "value": 6,
      "id": "purchase_3"
    },
    {
      "name": "login",
      "value": 1,
      "id": "login_6"
    },
    {
      "name": "nft_reward",
      "value": 2,
      "id": "nft_reward_3"
    },
    {
      "name": "purchase",
      "value": 1,
      "id": "purchase_6"
    }
  ],
  "links": [
    {
      "source": "play_games_3",
      "target": "play_games_4",
      "value": 4
    },
    {
      "source": "play_games_3",
      "target": "purchase_4",
      "value": 1
    },
    {
      "source": "login_1",
      "target": "purchase_2",
      "value": 2
    },
    {
      "source": "login_1",
      "target": "login_2",
      "value": 5
    },
    {
      "source": "login_1",
      "target": "play_games_2",
      "value": 9
    },
    {
      "source": "play_games_4",
      "target": "purchase_5",
      "value": 3
    },
    {
      "source": "play_games_4",
      "target": "nft_reward_5",
      "value": 1
    },
    {
      "source": "play_games_2",
      "target": "play_games_3",
      "value": 1
    },
    {
      "source": "play_games_2",
      "target": "purchase_3",
      "value": 4
    },
    {
      "source": "play_games_2",
      "target": "nft_reward_3",
      "value": 2
    },
    {
      "source": "purchase_4",
      "target": "purchase_5",
      "value": 1
    },
    {
      "source": "purchase_5",
      "target": "purchase_6",
      "value": 1
    },
    {
      "source": "purchase_5",
      "target": "login_6",
      "value": 1
    },
    {
      "source": "login_2",
      "target": "purchase_3",
      "value": 1
    },
    {
      "source": "login_2",
      "target": "play_games_3",
      "value": 4
    },
    {
      "source": "nft_reward_5",
      "target": "nft_reward_6",
      "value": 1
    },
    {
      "source": "purchase_2",
      "target": "purchase_3",
      "value": 1
    },
    {
      "source": "purchase_3",
      "target": "purchase_4",
      "value": 1
    },
    {
      "source": "purchase_3",
      "target": "play_games_4",
      "value": 2
    },
    {
      "source": "purchase_6",
      "target": "play_games_7",
      "value": 1
    }
  ]
}

export default { demoData, demoAllData, demoViewData };
