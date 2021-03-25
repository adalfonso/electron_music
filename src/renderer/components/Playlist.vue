<template>
  <section id="playlist">
    <section class="options">
      <div class="ui-button-set capitalize">
        <div
          v-for="state in states"
          :class="playlist.state === state ? 'selected' : ''"
          @click="playlist.state = state"
          :key="state"
        >
          {{ state }}
        </div>
      </div>
    </section>
    <div class="playlist-wrap">
      <table class="playlist">
        <tr>
          <th>Artist</th>
          <th>Album</th>
          <th>Year</th>
          <th>Title</th>
          <th>Track</th>
        </tr>

        <tr
          v-for="(file, index) in files"
          :class="indexClass(index)"
          @click="player.changeIndex(index)"
          :key="file._id"
        >
          <td>{{ file.artist }}</td>
          <td>{{ file.album }}</td>
          <td>{{ file.year }}</td>
          <td>
            {{ file.title.substring(0, 50).trim() }}
            {{ file.title.length > 50 ? "..." : "" }}
          </td>
          <td>{{ file.track }}</td>
        </tr>
      </table>
    </div>
  </section>
</template>

<script lang="ts">
import { PlaylistState } from "../lib/Playlist";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Player } from "@/lib/Player";

@Component
export default class PlaylistComponent extends Vue {
  /** Audio player */
  @Prop() player: Player;

  /** Possibly playlist states */
  states = PlaylistState;

  /** Get the files of the playlist */
  get files() {
    return this.playlist.getVisibleList();
  }

  /** Get the current playlist */
  get playlist() {
    return this.player.playlist;
  }

  /**
   * Get the class for an index in the playlist
   *
   * @param index - index number
   *
   * @return classes
   */
  indexClass(index: number): string {
    // If we are browsing, no tracks will have a special class
    if (this.playlist.isBrowsing()) {
      return "";
    }

    return index === this.playlist.index ? "selected" : "";
  }
}
</script>

<style lang="scss">
@import "@/global";

#playlist {
  background: $dark-blue;
  position: relative;
  display: flex;
  overflow: auto;
  flex-direction: column;
  flex: 1 1 auto;

  .options {
    border-bottom: 6px solid $dark-blue-hover;
    padding: 0.5rem;
    flex: 0 0 auto;
    user-select: none;
  }

  .playlist-wrap {
    flex: 1 1 auto;
    overflow: auto;
  }

  .playlist {
    color: $light-blue;
    text-align: left;
    width: 100%;

    td,
    th {
      padding: 0.2rem 0.5rem;
    }

    tr {
      cursor: pointer;
      user-select: none;

      &:hover,
      &.selected {
        td {
          background: $dark-blue-hover;
        }
      }
    }
  }
}
</style>
