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
import { Player } from "@/lib/Player";
import { Playlist } from "@/lib/Playlist";
import Settings from "@/lib/Settings";
import { settings_store } from "@/index";

export default {
  components: { fileMenu, categories, playlist, toolbar },

  data() {
    return {
      player: new Player(new Playlist([])),
      settings: new Settings(settings_store),
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
