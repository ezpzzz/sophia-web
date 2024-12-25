<template>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <div id="app">
    <chat-widget />
  </div>
</template>

<script>
import ChatWidget from '../../src/components/ChatWidget'

export default {
  name: 'App',
  components: {
    ChatWidget
  }
}
</script>

<style>
#app {
  font-family: 'Work Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 60px;
}
</style>
