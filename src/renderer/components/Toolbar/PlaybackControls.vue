<template>
  <div id="play-controls">
    <section class="other-options"></section>

    <section class="play-options">
      <div class="previous" @click="player.previous()">
        <div></div>
        <div></div>
      </div>

      <div class="play-button" @click="player.toggle()">
        <div v-if="player.is_playing" class="pause">
          <div></div>
          <div></div>
        </div>

        <div v-else class="play"></div>
      </div>

      <div class="next" @click="player.next()">
        <div></div>
        <div></div>
      </div>
    </section>

    <section class="volume-wrap">
      <div class="volume-control">
        <div class="volume-bar" :style="volumeStyles"></div>
        <div
          class="phantom-volume-bar"
          ref="phantomVolumeBar"
          @mousemove="onMouseMove"
          @mousedown="beginVolumeAdjust"
          @mouseleave="cancelVolumeAdjust"
          @mouseup="cancelVolumeAdjust"
        ></div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Player } from "@/lib/Player";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class PlaybackControlsComponent extends Vue {
  @Prop() player: Player;

  /** If the volume is currently being adjusted */
  is_adjusting_volume: boolean = false;

  /** x-position of the volume level */
  volume_drag_x: number = 0;

  /** Get CSS for the volume level */
  get volumeStyles() {
    const volume = this.is_adjusting_volume
      ? this.volume_drag_x / this.phantom_volume_bar.clientWidth
      : this.player.volume;

    return `width: ${volume * 100}%`;
  }

  /**
   * Get the phantom volume bar
   *
   * This is as an invisible overlay used to increase the clickable area
   * of the volume bar
   *
   * TODO: if there is a better way to make TS aware of the type, prefer that.
   */
  get phantom_volume_bar(): HTMLElement {
    return this.$refs.phantomVolumeBar as HTMLElement;
  }

  /** Handle mouse move events  */
  onMouseMove(event: MouseEvent) {
    this.volume_drag_x = event.offsetX;

    if (this.is_adjusting_volume) {
      this.adjustVolume(event);
    }
  }

  /** Start adjusting the volume */
  beginVolumeAdjust() {
    this.is_adjusting_volume = true;
  }

  /** Cancel the volume adjustment */
  cancelVolumeAdjust(event: MouseEvent) {
    if (!this.is_adjusting_volume) {
      return;
    }

    this.adjustVolume(event);

    this.is_adjusting_volume = false;
  }

  /** Cause a volume adjustment */
  adjustVolume(event: MouseEvent) {
    const percent =
      Math.min(event.offsetX) / this.phantom_volume_bar.clientWidth;

    this.player.adjustVolume(percent);
  }
}
</script>

<style lang="scss">
@import "@/global";

#play-controls {
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.other-options {
  flex-grow: 1;
  flex-basis: 0;
}

.play-options {
  display: flex;
  align-items: center;
  align-self: center;
  margin-top: 1rem;
  justify-content: center;
  flex-grow: 1;
  flex-basis: 0;

  .previous,
  .next {
    display: flex;

    div {
      border-bottom: 1rem solid transparent;
      border-top: 1rem solid transparent;
      height: 0;
      width: 0;
    }
  }

  .next {
    &:hover div {
      border-left: 1.5rem solid $med-blue-hover;
    }

    div {
      border-left: 1.5rem solid $med-blue;

      &:last-of-type {
        margin-left: -0.75rem;
      }
    }
  }

  .previous {
    &:hover div {
      border-right: 1.5rem solid $med-blue-hover;
    }

    div {
      border-right: 1.5rem solid $med-blue;

      &:first-of-type {
        margin-right: -0.75rem;
      }
    }
  }

  .play-button {
    align-items: center;
    background: $med-blue;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    height: 4rem;
    justify-content: center;
    margin: 0 1rem;
    width: 4rem;

    .play {
      border-bottom: 1rem solid transparent;
      border-left: 1.5rem solid $dark-blue;
      border-top: 1rem solid transparent;
      height: 0;
      margin-left: 0.25rem;
      width: 0;
    }

    .pause {
      display: flex;

      div {
        background: $dark-blue;
        height: 2rem;
        margin: 0.25rem;
        width: 0.5rem;
      }
    }

    &:hover {
      background: $med-blue-hover;
      transition: 0.2s;

      .play {
        border-left-color: $dark-blue-hover;
      }
      .pause div {
        background: $dark-blue-hover;
      }
    }
  }
}

.volume-wrap {
  align-self: flex-end;
  display: flex;
  flex-basis: 0;
  flex-grow: 1;
  justify-content: flex-end;

  .volume-control {
    border: 1px solid $light-blue;
    display: flex;
    height: 6px;
    position: relative;
    margin: 0.5rem 1rem;
    width: 10rem;

    .volume-bar {
      background: $light-blue;
      height: 100%;
      position: absolute;
    }

    .phantom-volume-bar {
      bottom: -1rem;
      cursor: pointer;
      left: 0;
      position: absolute;
      right: 0;
      top: -1rem;
      z-index: 15;
    }
  }
}
</style>
