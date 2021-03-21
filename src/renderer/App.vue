<template>
  <div id="app">
    <div id="wrap">
      <file-menu :settings="settings"> </file-menu>

      <categories :player="player" :settings="settings"> </categories>

      <playlist :player="player"> </playlist>

      <toolbar :player="player"> </toolbar>
    </div>
  </div>
</template>

<script>
import CategoriesComponent from "./components/Categories.vue";
import FileMenuComponent from "./components/FileMenu.vue";
import PlaylistComponent from "./components/Playlist.vue";
import ToolbarComponent from "./components/Toolbar.vue";
import { Player } from "@/lib/Player";
import { Playlist } from "@/lib/Playlist";
import { Settings } from "@/lib/Settings";
import { settings_store } from "@/index";

export default {
  components: {
    "file-menu": FileMenuComponent,
    categories: CategoriesComponent,
    playlist: PlaylistComponent,
    toolbar: ToolbarComponent
  },

  data() {
    return {
      player: new Player(new Playlist([])),
      settings: new Settings(settings_store)
    };
  }
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
