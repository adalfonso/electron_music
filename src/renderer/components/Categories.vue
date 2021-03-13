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
        <div v-for="medium in media" class="item">
          {{ medium.file_type }}
          <b class="stat">[{{ medium.percent }}%]</b>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import category from "./Categories/Section.vue";
import { library_store } from "@/index";

export default {
  components: { category },

  props: {
    player: { required: true },
    settings: { required: true },
  },

  data() {
    return {
      songs: [],

      selected: {
        artist: null,
        album: null,
        genre: null,
        last: null,
      },
    };
  },

  mounted() {
    setInterval(async () => {
      try {
        this.songs = await library_store.find({});
      } catch (error) {
        console.log("Failed to load media files.", error);
      }
    }, 5000);
  },

  computed: {
    categories() {
      return {
        artist: {
          list: this.artists,
          hasDefault: true,
          display: (item) => item,
        },
        album: {
          list: this.albums,
          hasDefault: true,
          display: (item) => (item.album ? item.album : "[Unknown Album]"),
        },
        genre: {
          list: this.genres,
          hasDefault: false,
          display: (item) => item,
        },
      };
    },

    artists() {
      return this.getUnique("artist");
    },

    albums() {
      let albums = this.selected.artist
        ? this.songs.filter((song) => song.artist === this.selected.artist)
        : this.songs;

      return albums
        .reduce(
          (carry, song) => {
            const album = song.album;

            if (carry.albums[album] === undefined) {
              carry.albums[album] = true;
              carry.acc.push(song);
            }

            return carry;
          },
          { albums: {}, acc: [] }
        )
        .acc.sort((a, b) => a.album.localeCompare(b.album));
    },

    genres() {
      return this.getUnique("genre").sort();
    },

    media() {
      const file_types = this.songs.reduce((carry, { file_type }) => {
        carry[file_type] = (carry[file_type] || 0) + 1;

        return carry;
      }, {});

      return Object.entries(file_types)
        .sort((a, b) => b[1] - a[1])
        .map(([file_type, count]) => ({
          file_type,
          count,
          percent: ((count / this.songs.length) * 100).toFixed(2),
        }));
    },

    selectMethod() {
      let str = this.selected.last;

      return this["select" + str.charAt(0).toUpperCase() + str.slice(1)];
    },
  },

  methods: {
    getUnique(key) {
      return [...new Set(this.songs.map((song) => song[key]))];
    },

    selectCategory(type, item, play) {
      this.selected[type] = item;
      this.selected.last = type;
      this.selectMethod(item, play);
    },

    selectArtist(artist, play = false) {
      let songs = this.songs
        .filter((song) => song.artist === artist)
        .sort((a, b) => (a.album + a.track).localeCompare(b.album + b.track));

      this.player.changePlaylist(songs, play);
    },

    selectAlbum(album, play = false) {
      let compilationArtists = this.settings.has("compilationArtists");

      let songs = this.songs
        .filter(
          (song) =>
            song.album === album.album &&
            song.year === album.year &&
            (compilationArtists ? true : song.artist === album.artist)
        )
        .sort((a, b) => a.track - b.track);

      this.player.changePlaylist(songs, play);
    },

    selectGenre(genre, play = false) {
      const genreFormat = (song) =>
        song.artist.padEnd(40, "") +
        song.album.padEnd(20, "") +
        song.track.toString().padStart(3, "0");

      let songs = this.songs
        .filter((song) => song.genre === genre)
        .sort((a, b) => genreFormat(a).localeCompare(genreFormat(b)));

      this.player.changePlaylist(songs, play);
    },
  },
};
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
