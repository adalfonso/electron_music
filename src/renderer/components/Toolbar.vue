<template>
  <section id="toolbar">
    <template v-show="nowPlaying">
      <h2 class="now-playing">
        <template v-if="nowPlaying">
          {{ nowPlaying.artist }} - {{ nowPlaying.title }}
        </template>
        <template v-else>...</template>
      </h2>

      <seekbar :player="player"></seekbar>
      <playback-controls :player="player"></playback-controls>
    </template>
  </section>
</template>

<script>
import PlaybackControlsComponent from "./Toolbar/PlaybackControls.vue";
import SeekbarComponent from "./Toolbar/Seekbar.vue";

export default {
  components: {
    "playback-controls": PlaybackControlsComponent,
    seekbar: SeekbarComponent,
  },

  props: {
    player: { required: true },
  },

  computed: {
    nowPlaying() {
      return this.player.playlist.now_playing;
    },
  },
};
</script>

<style lang="scss">
@import "@/global";

#toolbar {
  background: $dark-blue;
  border-top: 6px solid $dark-blue-hover;
  height: 150px;
  min-height: 150px;
  position: relative;
  align-items: center;
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;

  .now-playing {
    color: $light-blue;
    margin: 0.5rem 0 0 0;
    max-height: 1.5rem;
    text-align: center;
    user-select: none;
  }

  .player {
    display: none;
  }
}
</style>
