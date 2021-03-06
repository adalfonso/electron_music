<template>
  <section id="file-menu">
    <div class="menu-item" @click="browse">
      Library
    </div>

    <div class="menu-item">
      Settings
      <ul class="settings">
        <li @click="settings.toggle('compilationArtists')">
          <span v-if="settings.has('compilationArtists')">&#10004;</span>
          Show all artists on compilations
        </li>
      </ul>
    </div>

    <file-browser v-if="browsing" @hide="browsing = false"> </file-browser>
  </section>
</template>

<script>
import fileBrowser from "./FileMenu/FileBrowser.vue";

export default {
  components: { fileBrowser },

  props: {
    settings: { required: true },
  },

  data() {
    return {
      browsing: false,
    };
  },

  methods: {
    browse() {
      this.browsing = true;
    },
  },
};
</script>

<style lang="scss">
#file-menu {
  background: $dark-blue;
  color: #fff;
  display: flex;
  font-weight: 300;
  height: 2rem;
  min-height: 2rem;
  flex: 0 0 auto;

  .menu-item {
    line-height: 1rem;
    padding: 0.5rem;
    transition: 0.2s;
    position: relative;
    user-select: none;

    &:hover {
      background: $med-blue;
      color: $light-blue;

      > * {
        display: block;
      }
    }
  }

  .settings {
    background: $med-blue;
    display: none;
    list-style: none;
    padding: 0;
    margin: 0;
    color: white;
    left: 0;
    position: absolute;
    top: 100%;
    border-top-right-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;

    li {
      padding: 0.5rem;
      white-space: nowrap;

      &:hover {
        background: $med-blue-hover;
      }

      &:first-of-type {
        border-top-right-radius: 0.25rem;
      }

      &:last-of-type {
        border-bottom-right-radius: 0.25rem;
        border-bottom-left-radius: 0.25rem;
      }
    }
  }
}
</style>
