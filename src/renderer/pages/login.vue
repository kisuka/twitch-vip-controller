<template>
  <section class="section">
    <div class="container">
      <b-field label="App Client ID">
        <b-input type="password" :value="clientId" @input="updateClientID" password-reveal />
      </b-field>

      <b-field>
        <b-button type="is-primary" expanded @click="login">Login</b-button>
      </b-field>
    </div>
  </section>
</template>

<script>
import { remote } from 'electron'
import { mapGetters } from 'vuex'
import { ApiClient } from 'twitch'
import { ElectronAuthProvider } from 'twitch-electron-auth-provider'

let twitchAPI = null
let chatAPI = null

async function login (clientID) {
  let twitchWindow = new remote.BrowserWindow({
    parent: remote.getCurrentWindow(),
    modal: true
  })

  const authProvider = new ElectronAuthProvider({
    clientId: clientID,
    redirectUri: 'http://localhost/login'
  }, {
    window: twitchWindow
  })

  const result = await authProvider.getAccessToken([
    'chat:read',
    'chat:edit',
    'channel:moderate',
    'channel:manage:redemptions',
    'channel:read:redemptions'
  ])

  twitchAPI = new ApiClient({ authProvider })

  const me = await twitchAPI.helix.users.getMe()

  return { accessToken: result.accessToken, name: me.name, userId: me.id }
}

export default {
  computed: {
    ...mapGetters({
      clientId: 'settings/getClientID',
      accessToken: 'settings/getAccessToken',
      channelName: 'settings/getChannelName',
      userId: 'settings/getUserId'
    })
  },
  methods: {
    updateClientID (value) {
      this.$store.dispatch('settings/setClientID', value)
    },
    login () {
      if (this.clientId == '') {
        alert('You need to enter your client ID')
        return
      }

      login(this.clientId).then(result => {
        this.$store.dispatch('settings/setAccessToken', result.accessToken)
        this.$store.dispatch('settings/setChannelName', result.name)
        this.$store.dispatch('settings/setUserId', result.userId)

        this.$router.push('/')
      });
    }
  }
}
</script>
