<template>
  <div id="app">
    <ChatBot />
    <div class="container">
      <a href="https://sherpa4selfie.eu/" target="_blank">
        <img
          alt="SHERPA4SELFIE logo"
          src="./assets/cropped-logo-large.jpg"
          class="mx-auto d-block img-fluid"
        />
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import ChatBot from "./components/ChatBot.vue";

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "@fortawesome/fontawesome-free/css/all.css";

@Component({
  components: {
    ChatBot
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
