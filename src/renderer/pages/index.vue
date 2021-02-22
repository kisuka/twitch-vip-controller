<template>
  <section class="section">
    <div class="container">
      <b-field label="VIP Channel Reward">
        <b-select placeholder="Select a reward" :value="rewardId" @input="updateVipReward" expanded>
          <option
            v-for="option in rewards.data"
            :value="option.id"
            :key="option.id">
            {{ option.title }}
          </option>
        </b-select>
      </b-field>

      <b-field label="VIP Status Expiry (in days)" message="Put 0 for no expiry">
        <b-numberinput :value="vipExpireDays" :min="0" @input="updateVipExpireDays" />
      </b-field>

      <hr />

      <b-field>
        <b-button v-if="!started" type="is-primary" @click="startApp" expanded>Start</b-button>
        <b-button v-if="started" type="is-danger" @click="stopApp" expanded>Stop</b-button>
      </b-field>
    </div>
  </section>
</template>

<script>
import { remote } from 'electron'
import { mapGetters } from 'vuex'
import { ApiClient } from 'twitch'
import { StaticAuthProvider } from 'twitch-auth'
import { PubSubClient } from 'twitch-pubsub-client'

const tmi = require('tmi.js')
const sqlite3 = require('sqlite3')

const app = remote.app

let twitchAPI = null
let chatAPI = null
let authProvider = null;
let redemptionListener = null

/**
 * Helper function to open the sqlite3 database file.
 */
function openDB() {
  return new sqlite3.Database(app.getPath('userData') + '\\vip-controller.db', (err) => {
      if (err) console.error('Database opening error: ', err);
  })
}

/**
 * Creates the database schema if it doesn't exist yet.
 */
function initDB() {
  const db = openDB()

  db.run(`
    CREATE TABLE IF NOT EXISTS vips (
      user_id INTEGER PRIMARY KEY,
      user_name TEXT NOT NULL UNIQUE,
      expires_at INTEGER NOT NULL
    )
  `)

  db.close()
}

/**
 * Adds a VIP'd user to the database to track expire date.
 * 
 * @param {integer} userID  The user's unique ID.
 * @param {string} userName The user's username.
 */
function addVip (userID, userName) {
  const db = openDB()

  const expiry = parseInt(window.$nuxt.$store.getters["settings/getVipExpireDays"])
  
  if (expiry != 0) {
    let date = new Date()
    date.setDate(date.getDate() + expiry)
    date = Math.floor(date.getTime() / 1000)

    db.run("INSERT or IGNORE INTO vips (user_id, user_name, expires_at) VALUES (?, ?, ?)", userID, userName, date)
  }

  db.close()
}

/**
 * Unvips all users who have reached the expire time.
 */
function removeVips () {
  const channelName = window.$nuxt.$store.getters["settings/getChannelName"]

  const db = openDB()

  let date = Math.floor(new Date().getTime() / 1000)

  db.all("SELECT * FROM vips WHERE expires_at <= ?", [date], (err, rows) => {
    rows.forEach((row) => {
      chatAPI.unvip(channelName, row.user_name).then((data) => {
        db.run("DELETE FROM vips WHERE user_id = ?", row.user_id)
      })
    })
  })

  db.close()
}

/**
 * Initialize twitch APIs.
 */
async function init () {
  const clientID = window.$nuxt.$store.getters["settings/getClientID"]
  const accessToken = window.$nuxt.$store.getters["settings/getAccessToken"]
  const channelName = window.$nuxt.$store.getters["settings/getChannelName"]

  authProvider = new StaticAuthProvider(clientID, accessToken);
  twitchAPI = new ApiClient({ authProvider })
  
  chatAPI = new tmi.Client({
    options: { debug: true, messagesLogLevel: "info" },
    connection: {
      reconnect: true,
      secure: true
    },
    identity: {
      username: channelName,
      password: 'oauth:' + accessToken
    },
    channels: [ channelName ]
  });
}

/**
 * Connect to chat and begin listening for redemptions.
 */
async function appInit () {
  const rewardId = window.$nuxt.$store.getters["settings/getRewardID"]
  const channelName = window.$nuxt.$store.getters["settings/getChannelName"]
  const broadcaster = window.$nuxt.$store.getters["settings/getUserId"]

  // Connect to chat
  await chatAPI.connect().catch(console.error);

  // Check for any existing VIPs that have expired and remove them
  removeVips()

  // Setup redemption listener
  const pubSubClient = new PubSubClient();
  const userId = await pubSubClient.registerUserListener(twitchAPI);

  redemptionListener = await pubSubClient.onRedemption(userId, (message) => {
    if (message.rewardId == rewardId) {
      chatAPI.vip(channelName, message.userName).then((data) => {
        // Add to database
        addVip(message.userId, message.userName)

        // Mark redemption as fulfilled
        twitchAPI.helix.channelPoints.updateRedemptionStatusByIds(broadcaster, rewardId, [message.id], "FULFILLED")
      })
    }
  });
}

export default {
  async created() {
    if (!this.accessToken) {
      return this.$router.push('/login')
    }

    initDB()
    await init()
  },
  data () {
    return {
      started: false,
      rewards: []
    }
  },
  async fetch() {
    const rewards = await twitchAPI.helix.channelPoints.getCustomRewards(this.userId)
    .then((res) => res.json())
    .catch(err => {
      this.$nuxt.error({ statusCode: err.body.status, message: err.body.message })
    })

    this.rewards = rewards
  },
  computed: {
    ...mapGetters({
      vipExpireDays: 'settings/getVipExpireDays',
      clientId: 'settings/getClientID',
      accessToken: 'settings/getAccessToken',
      channelName: 'settings/getChannelName',
      userId: 'settings/getUserId',
      rewardId: 'settings/getRewardID'
    })
  },
  methods: {
    updateVipExpireDays (value) {
      this.$store.dispatch('settings/setDays', value)
    },
    updateVipReward (value) {
      this.$store.dispatch('settings/setRewardID', value)
    },
    startApp () {
      if (this.rewardId == '') {
        alert('You need to select your VIP channel reward.')
        return
      }

      appInit()

      this.started = true
    },
    stopApp() {
      redemptionListener.remove()
      chatAPI.disconnect()

      this.started = false
    }
  }
}
</script>
