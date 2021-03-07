<template>
  <section class="seekbar-wrap">
    <div class="time">
      <div class="current" v-show="player.currentTime">{{ currentTime }}</div>
      <div class="duration" v-show="player.duration">{{ duration }}</div>
    </div>

    <div class="seeker">
      <div class="seekbar" :style="style"></div>
      <div
        class="phantom-seekbar"
        ref="phantomSeekbar"
        @mousemove="move"
        @mousedown="selectSeek"
        @mouseleave="releaseSeek"
        @mouseup="releaseSeek"
      ></div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    player: { required: true },
  },

  data() {
    return {
      seeking: false,
      currentX: 0,
    };
  },

  computed: {
    currentTime() {
      return this.minutify(this.player.currentTime);
    },

    duration() {
      return this.minutify(this.player.duration);
    },

    style() {
      let ratio = this.seeking
        ? this.currentX / this.$refs.phantomSeekbar.clientWidth
        : this.player.currentTime / this.player.duration;

      let percent = 100 - ratio * 100;

      return "width:" + percent + "%";
    },
  },

  methods: {
    minutify(time) {
      let minutes = parseInt(Math.floor(time / 60));
      let seconds = Math.round(time - minutes * 60);
      return minutes + ":" + seconds.toString().padStart(2, "0");
    },

    move(event) {
      this.currentX = event.offsetX;
    },

    selectSeek(event) {
      if (this.player.audio.src) {
        this.seeking = true;
      }
    },

    releaseSeek(event) {
      if (!this.seeking) {
        return;
      }

      let percent =
        Math.min(event.offsetX) / this.$refs.phantomSeekbar.clientWidth;

      this.player.goTo(percent);

      this.seeking = false;
    },
  },
};
</script>

<style lang="scss">
@import "@/global";

.seekbar-wrap {
  margin-top: -1rem;
  width: 100%;
}

.time {
  color: $light-blue;
  display: flex;
  justify-content: space-between;
  margin: 0.5rem;
  user-select: none;
  height: 1.25rem;
}

.seeker {
  background: $light-blue;
  display: flex;
  justify-content: flex-end;
  height: 2px;
  width: 100%;
  position: relative;

  .seekbar {
    background: firebrick;
    bottom: -1px;
    height: 4px;
    position: absolute;
  }

  .phantom-seekbar {
    position: absolute;
    bottom: -1rem;
    top: -2rem;
    left: 0;
    right: 0;
    z-index: 15;
    cursor: pointer;
  }
}
</style>
