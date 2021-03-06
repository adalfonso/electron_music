<template>
  <section id="toolbar">
    <template v-show="nowPlaying">
      <h2 class="now-playing">
        <template v-if="nowPlaying">
          {{ nowPlaying.artist }} - {{ nowPlaying.title }}
        </template>
        <template v-else>N / A</template>
      </h2>

      <seekbar :player="player"></seekbar>
      <playbackControls :player="player"></playbackControls>
    </template>
  </section>
</template>

<script>
import playbackControls from "./Toolbar/PlaybackControls.vue";
import seekbar from "./Toolbar/Seekbar.vue";

export default {
  components: { playbackControls, seekbar },

  props: {
    player: { required: true },
  },

  computed: {
    nowPlaying() {
      return this.player.playlist.nowPlaying();
    },
  },
};
</script>

<style lang="scss">
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
