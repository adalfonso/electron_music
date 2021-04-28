<template>
  <div id="app">
    <div id="wrap">
      <file-menu :settings="settings"> </file-menu>
      <categories :player="player" :settings="settings"></categories>
      <playlist :player="player"> </playlist>
      <toolbar :player="player"> </toolbar>
    </div>
  </div>
</template>

<script lang="ts">
import CategoriesComponent from "./components/Categories.vue";
import FileMenuComponent from "./components/FileMenu.vue";
import PlaylistComponent from "./components/Playlist.vue";
import ToolbarComponent from "./components/Toolbar.vue";
import { Player } from "@/player/Player";
import { Playlist } from "@/player/playlist/Playlist";
import { Settings } from "@/Settings";
import { Vue, Component } from "vue-property-decorator";
import { logger, settings_store } from "@/index";

@Component({
  components: {
    "file-menu": FileMenuComponent,
    categories: CategoriesComponent,
    playlist: PlaylistComponent,
    toolbar: ToolbarComponent,
  },
})
export default class AppComponent extends Vue {
  /** Audio player */
  player: Player = new Player(new Playlist([]));

  /** User Settings */
  settings: Settings = new Settings(settings_store);

  mounted() {
    logger.info("Application mounted");
  }
}
</script>

<style lang="scss">
#wrap {
  align-items: stretch;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
