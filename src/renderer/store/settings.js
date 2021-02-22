import fs from 'fs'
import { remote } from 'electron'
const app = remote.app

export const state = () => ({
  vipExpireDays: '30',
  clientID: '',
  accessToken: '',
  channelName: '',
  userId: '',
  userName: '',
  rewardID: ''
})

export const mutations = {
  setVipExpireDays (state, days) {
    const path = app.getPath('userData') + '\\vip_controller_settings.json'

    state.vipExpireDays = days

    const settings = JSON.stringify(state)
    fs.writeFileSync(path, settings)
  },
  updateClientID (state, id) {
    const path = app.getPath('userData') + '\\vip_controller_settings.json'

    state.clientID = id

    const settings = JSON.stringify(state)
    fs.writeFileSync(path, settings)
  },
  updateRewardID (state, id) {
    const path = app.getPath('userData') + '\\vip_controller_settings.json'

    state.rewardID = id

    const settings = JSON.stringify(state)
    fs.writeFileSync(path, settings)
  },
  updateChannelName (state, channel) {
    const path = app.getPath('userData') + '\\vip_controller_settings.json'

    state.channelName = channel

    const settings = JSON.stringify(state)
    fs.writeFileSync(path, settings)
  },
  updateUserName (state, name) {
    const path = app.getPath('userData') + '\\vip_controller_settings.json'

    state.userName = id

    const settings = JSON.stringify(state)
    fs.writeFileSync(path, settings)
  },
  updateUserId (state, id) {
    const path = app.getPath('userData') + '\\vip_controller_settings.json'

    state.userId = id

    const settings = JSON.stringify(state)
    fs.writeFileSync(path, settings)
  },
  updateAccessToken (state, token) {
    const path = app.getPath('userData') + '\\vip_controller_settings.json'

    state.accessToken = token

    const settings = JSON.stringify(state)
    fs.writeFileSync(path, settings)
  },
  setSettings (state, payload) {
    state = Object.assign(state, payload)
  },
  createSettingsFile (state) {
    const path = app.getPath('userData') + '\\vip_controller_settings.json'
    const settings = JSON.stringify(state)
    fs.writeFileSync(path, settings)
  }
}

export const getters = {
  getVipExpireDays (state) {
    return state.vipExpireDays
  },
  getClientID (state) {
    return state.clientID
  },
  getRewardID (state) {
    return state.rewardID
  },
  getAccessToken (state) {
    return state.accessToken
  },
  getChannelName (state) {
    return state.channelName
  },
  getUserId (state) {
    return state.userId
  },
  getUserName (state) {
    return state.userName
  }
}

export const actions = {
  async init ({ commit }) {
    const path = app.getPath('userData') + '\\vip_controller_settings.json'
    try {
      const settings = fs.readFileSync(path)
      const settingsObj = JSON.parse(settings)
      if (settingsObj) {
        commit('setSettings', settingsObj)
      }
    } catch (err) {
      commit('createSettingsFile')
    }
  },
  setDays ({ commit }, value) {
    commit('setVipExpireDays', value)
  },
  setClientID ({ commit }, value) {
    commit('updateClientID', value)
  },
  setRewardID ({ commit }, value) {
    commit('updateRewardID', value)
  },
  setAccessToken ({ commit }, value) {
    commit('updateAccessToken', value)
  },
  setChannelName ({ commit }, value) {
    commit('updateChannelName', value)
  },
  setUserId ({ commit }, value) {
    commit('updateUserId', value)
  },
  setUserName ({ commit }, value) {
    commit('updateUserName', value)
  }
}