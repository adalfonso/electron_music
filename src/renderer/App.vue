<template>
  <div id="app">
    <div id="wrap">
      <fileMenu :settings="settings"> </fileMenu>

      <categories :player="player" :settings="settings"> </categories>

      <playlist :player="player"> </playlist>

      <toolbar :player="player"> </toolbar>
    </div>
  </div>
</template>

<script>
import fileMenu from "./components/FileMenu.vue";
import categories from "./components/Categories.vue";
import playlist from "./components/Playlist.vue";
import toolbar from "./components/Toolbar.vue";
import Player from "@/lib/Player.js";
import Settings from "@/lib/Settings.js";

export default {
  components: { fileMenu, categories, playlist, toolbar },

  data() {
    return {
      player: new Player([], this.$db),
      settings: new Settings(),
    };
  },
};
</script>

<style lang="scss">
#wrap {
  align-items: stretch;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
