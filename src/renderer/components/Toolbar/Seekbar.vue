<template>
  <section class="seekbar-wrap">
    <div class="time">
      <div class="current" v-show="player.current_time">{{ current_time }}</div>
      <div class="duration" v-show="player.duration">{{ duration }}</div>
    </div>

    <div class="seeker">
      <div class="seekbar" :style="seekbar_style"></div>
      <div
        class="phantom-seekbar"
        ref="phantomSeekbar"
        @mousemove="onMouseMove"
        @mousedown="beginSeek"
        @mouseleave="cancelSeek"
        @mouseup="cancelSeek"
      ></div>
    </div>
  </section>
</template>

<script lang="ts">
import { Player } from "@/player/Player";
import { Vue, Component, Prop, Ref } from "vue-property-decorator";

@Component
export default class SeekbarComponent extends Vue {
  @Prop() player: Player;

  /**
   * Get the phantom seekbar
   *
   * This is as an invisible overlay used to increase the clickable area
   * of the seekbar
   */
  @Ref("phantomSeekbar") readonly phantom_seekbar!: HTMLDivElement;

  /** If the seekbar is currently seeking */
  is_seeking: boolean = false;

  /** x-position of the seekbar */
  seekbar_drag_x: number = 0;

  /** Current time to display on the seekbar */
  get current_time(): string {
    return this.minutify(this.player.current_time);
  }

  /** Track duration to display on the seekbar */
  get duration(): string {
    return this.minutify(this.player.duration);
  }

  /** Dynamic CSS of the seekbar */
  get seekbar_style() {
    const ratio = this.is_seeking
      ? this.seekbar_drag_x / this.phantom_seekbar.clientWidth
      : this.player.current_time / this.player.duration;

    const percent = 100 - ratio * 100;

    return `width: ${percent}%`;
  }

  /**
   * Convert a numeric time into a mm:ss
   *
   * @paramn time - numeric time
   *
   * @return formatted time
   *
   */
  minutify(time: number) {
    const minutes = Math.round(Math.floor(time / 60));
    const seconds = Math.round(time - minutes * 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  /** Handle mouse move events */
  onMouseMove(event: MouseEvent) {
    this.seekbar_drag_x = event.offsetX;
  }

  /** Begin seek operation */
  beginSeek() {
    if (this.player.hasAudioSource()) {
      this.is_seeking = true;
    }
  }

  /** Cancel seek operation */
  cancelSeek(event: MouseEvent) {
    if (!this.is_seeking) {
      return;
    }

    const percent = Math.min(event.offsetX) / this.phantom_seekbar.clientWidth;

    this.player.goTo(percent);
    this.is_seeking = false;
  }
}
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
