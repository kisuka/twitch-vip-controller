<template>
  <div>
    <nuxt keep-alive />
  </div>
</template>

<style>
  ::-webkit-scrollbar {
    display: none;
  }
</style>

<script>
import { mapGetters } from 'vuex'

export default {
	created () {
	    this.$store.dispatch('settings/init')
	}
}
</script>