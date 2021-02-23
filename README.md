# VIP Controller

> An app to help Twitch streamers automate VIP redemption and removal.

#### Streamer Setup

1. Visit the [Twitch Developers Portal](https://dev.twitch.tv/console/apps) and register a new application.
2. Name the app anything you want, enter `http://localhost/login` for the OAuth Redirect URL, select Chat Bot for the category, and then click the Create button.
3. Copy the `Client ID` and start the application.
4. Paste the `Client ID` into the field and click the login button.
5. Select the Channel Reward which is meant for your VIP redemption.
6. Enter how many days you want a VIP badge to remain.
7. When ready click on the Start button.

#### Development Help

``` bash
# install dependencies
yarn install

# serve app with hot reload
yarn run dev

# build application for production
yarn run build


```

---

This project was generated with [electron-nuxt](https://github.com/michalzaq12/electron-nuxt) v1.6.0 using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://github.com/michalzaq12/electron-nuxt/blob/master/README.md).
