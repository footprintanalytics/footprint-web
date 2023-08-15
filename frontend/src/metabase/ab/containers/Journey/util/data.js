const demoData = {
  "nodes": [
    {
      "name": "nft_reward",
      "value": 1,
      "id": "nft_reward_3"
    },
    {
      "name": "play_games",
      "value": 1,
      "id": "play_games_4"
    },
    {
      "name": "open_app",
      "value": 1,
      "id": "open_app_4"
    },
    {
      "name": "purchase",
      "value": 1,
      "id": "purchase_2"
    },
    {
      "name": "close_app",
      "value": 1,
      "id": "close_app_3"
    },
    {
      "name": "purchase",
      "value": 3,
      "id": "purchase_3"
    },
    {
      "name": "login",
      "value": 6,
      "id": "login_1"
    },
    {
      "name": "play_games",
      "value": 5,
      "id": "play_games_2"
    }
  ],
  "links": [
    {
      "source": "purchase_3",
      "target": "open_app_4",
      "value": 1
    },
    {
      "source": "purchase_3",
      "target": "play_games_4",
      "value": 1
    },
    {
      "source": "login_1",
      "target": "play_games_2",
      "value": 5
    },
    {
      "source": "login_1",
      "target": "purchase_2",
      "value": 1
    },
    {
      "source": "play_games_2",
      "target": "close_app_3",
      "value": 1
    },
    {
      "source": "play_games_2",
      "target": "purchase_3",
      "value": 3
    },
    {
      "source": "play_games_2",
      "target": "nft_reward_3",
      "value": 1
    }
  ]
}

export default demoData;
