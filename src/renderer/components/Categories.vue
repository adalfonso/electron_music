<template>
  <section id="categories">
    <category
      v-for="(cat, type) in categories"
      :type="type"
      :key="type"
      :cat="cat"
      :selected="selected"
      @select="selectCategory"
      @reset="selected[type] = null"
    >
    </category>

    <div class="category">
      <h5>Media</h5>
      <div class="items" id="category-media">
        <div
          v-for="medium in this.transformer.media"
          class="item"
          :key="medium.file_type"
        >
          {{ medium.file_type }}
          <b class="stat">[{{ medium.percent }}%]</b>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import category from "./Categories/Category.vue";
import { MediaMetaData } from "@/media/Media";
import { Player } from "@/lib/Player";
import { Settings } from "@/lib/Settings";
import { Vue, Component, Prop } from "vue-property-decorator";
import { library_store } from "@/index";
import { media_transformations } from "@/media/Transform";

@Component({ components: { category } })
export default class CategoriesComponent extends Vue {
  /** Audio player */
  @Prop() player: Player;

  /** User settings */
  @Prop() settings: Settings;

  /** All library files */
  files: MediaMetaData[] = [];

  /** Currently selected media properties */
  selected: Record<string, string> = {
    artist: null,
    album: null,
    genre: null,
    last: null,
  };

  mounted() {
    /** Hack for now for the next little while */
    setInterval(async () => {
      try {
        this.files = await library_store.find({});
      } catch (error) {
        console.log("Failed to load media files.", error);
      }
    }, 5000);
  }

  get categories() {
    return {
      artist: {
        list: this.transformer.artists,
        hasDefault: true,
        display: (artist) => artist,
      },
      album: {
        list: this.transformer.albums(this.selected.artist),
        hasDefault: true,
        display: (album) => album.name || "[Unknown Album]",
      },
      genre: {
        list: this.transformer.genres,
        hasDefault: false,
        display: (genre) => genre,
      },
    };
  }

  get selectMethod() {
    let str = this.selected.last;

    return this["select" + str.charAt(0).toUpperCase() + str.slice(1)];
  }

  get transformer() {
    return media_transformations(this.files);
  }

  selectCategory(type, item, play) {
    this.selected[type] = item;
    this.selected.last = type;
    this.selectMethod(item, play);
  }

  selectArtist(artist, play = false) {
    let songs = this.files
      .filter((song) => song.artist === artist)
      .sort((a, b) => (a.album + a.track).localeCompare(b.album + b.track));

    this.player.changePlaylist(songs, play);
  }

  selectAlbum(album, play = false) {
    let compilations_enabled = this.settings.has("compilationArtists");
    let songs = this.files
      .filter((song) => {
        const show_compilations = compilations_enabled && !!album.name;
        const show_unknown_album = !album.name && !this.selected.artist;
        const artist_is_irrelevant = show_compilations || show_unknown_album;
        const artist_match = artist_is_irrelevant
          ? true
          : song.artist === album.artist;

        return (
          song.album === album.name && song.year === album.year && artist_match
        );
      })
      .sort((a, b) => Number(a.track) - Number(b.track));

    this.player.changePlaylist(songs, play);
  }

  selectGenre(genre, play = false) {
    const genreFormat = (song) =>
      song.artist.padEnd(40, "") +
      song.album.padEnd(20, "") +
      song.track.toString().padStart(3, "0");

    let songs = this.files
      .filter((song) => song.genre === genre)
      .sort((a, b) => genreFormat(a).localeCompare(genreFormat(b)));

    this.player.changePlaylist(songs, play);
  }
}
</script>

<style lang="scss">
@import "@/global";

#categories {
  border-bottom: 6px solid $dark-blue-hover;
  display: flex;
  justify-content: space-around;
  min-height: 300px;
  flex: 0 0 auto;

  .category {
    background: $dark-blue-hover;
    display: flex;
    flex-direction: column;
    width: 25%;

    h5 {
      color: $med-blue-hover;
      font-size: 1rem;
      font-weight: 400;
      margin: 0.5rem;
      text-align: center;
    }

    .items {
      background: $dark-blue;
      cursor: pointer;
      color: $light-blue;

      height: 300px;
      overflow-y: scroll;
      width: 100%;

      .stat {
        margin-left: 0.25rem;
      }

      .item {
        border-bottom: 1px solid $dark-blue;
        display: flex;
        justify-content: space-between;
        padding: 0.2rem 0.5rem;
        user-select: none;

        &:hover,
        &.selected {
          background: $dark-blue-hover;
        }

        &:last-of-type {
          border-bottom: none;
        }
      }
    }
  }
}
</style>
