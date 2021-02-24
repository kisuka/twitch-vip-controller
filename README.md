# VIP Controller

> An app to help Twitch streamers automate VIP redemption and removal.

<p align="center" width="100%">
	<img src="https://github.com/kisuka/twitch-vip-controller/raw/main/build/icons/256x256.png">
</p>

## Streamer Setup

1. Create a Custom Reward on your [Manage Rewards](https://dashboard.twitch.tv/viewer-rewards/channel-points/rewards) page on Twitch. This is the reward viewers will redeem when they want to unlock the VIP badge. Make sure that **Skip Reward Requests Queue** is enabled so that it doesn't clutter up your redemption queue.
1. Visit the [Twitch Developers Portal](https://dev.twitch.tv/console/apps) and register a new application.
2. Name the app anything you want, enter `http://localhost/login` for the OAuth Redirect URL, select Chat Bot for the category, and then click the Create button.
3. Copy the `Client ID` and start the application.
4. Paste the `Client ID` into the field and click the login button.
5. Select the Custom Reward you made in the first step.
6. Enter how many days you want a VIP badge to remain; you can enter 0 for badges that don't expire automatically.
7. Before you're ready to stream click on the Start button.

#### Recommended Usage

Before you are about to stream, open VIP Controller and click on the Start button, then simply leave the VIP Controller running in the background to manage your VIP redemptions. When you are done streaming, you can close VIP Controller and then simply open it again when you are ready to start streaming again.

## Development Help

``` bash
# install dependencies
yarn install

# serve app with hot reload
yarn run dev

# build application for production
yarn run build


```

## FAQ

**Question:** Why is this a desktop application?

**Answer:** Due to the fact that this app needs permissions for redemptions and can create chat messages using your broadcaster account, I figured that streamers would feel safer knowing that they control the application and the connection to it rather than some random web application where they don't know the person controlling the app.

##
**Question:** Will this auto-add VIP redemptions that were redeemed while I was not streaming?

**Answer:** It can but only if VIP Controller is still running on a computer somewhere. It currently cannot process redemptions that happened while it wasn't running.

##
**Question:** How exactly does this work?

**Answer:** When you start VIP Controller, it checks a database file which is saved on your computer to see if any previously redeemed VIPs have expired based off your settings. If there are expired VIPs, it will trigger `/unvip` commands in your channel's chat using your account for that VIP. Once that is done, the app begins listening for any custom reward redemptions, if the reward redeemed is the one you set in your settings, it will perform a `/vip` command in your chat using your account and add the user's information to the local database file so it can be checked for expiration later.

---

This project was generated with [electron-nuxt](https://github.com/michalzaq12/electron-nuxt) v1.6.0 using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://github.com/michalzaq12/electron-nuxt/blob/master/README.md).
