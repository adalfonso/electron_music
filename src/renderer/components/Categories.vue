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
          {{ medium.type }}
          <b class="stat">[{{ medium.percent }}%]</b>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Collection from "@/lib/Collection.js";
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
      } catch (e) {
        console.log("Failed to load media files.", e);
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
      return new Collection(this.songs)
        .unique("artist")
        .map((song) => song.artist)
        .sort()
        .use();
    },

    albums() {
      let albums = this.selected.artist
        ? this.songs.filter((song) => song.artist === this.selected.artist)
        : this.songs;

      return new Collection(albums)
        .unique("album")
        .sortBy("album")
        .use();
    },

    genres() {
      return new Collection(this.songs)
        .unique("genre")
        .map((song) => song.genre)
        .filter((genre) => genre)
        .sort()
        .use();
    },

    media() {
      let total = this.songs.length;

      return new Collection(this.songs)
        .groupBy((song) => song.path.match(/.([\w\d]+)$/)[1])
        .map((group, key) => {
          return {
            type: key.toUpperCase(),
            count: group.length,
            percent: ((group.length / total) * 100).toFixed(2),
          };
        })
        .sortByDesc("count")
        .use();
    },

    selectMethod() {
      let str = this.selected.last;

      return this["select" + str.charAt(0).toUpperCase() + str.slice(1)];
    },
  },

  methods: {
    selectCategory(type, item, play) {
      this.selected[type] = item;
      this.selected.last = type;
      this.selectMethod(item, play);
    },

    selectArtist(artist, play = false) {
      let songs = this.$collect(this.songs)
        .filter((song) => song.artist === artist)
        .sortBy((song) => song.album + song.track)
        .use();

      this.player.changePlaylist(songs, play);
    },

    selectAlbum(album, play = false) {
      let compilationArtists = this.settings.has("compilationArtists");

      let songs = this.$collect(this.songs)
        .filter(
          (song) =>
            song.album === album.album &&
            song.year === album.year &&
            (compilationArtists ? true : song.artist === album.artist)
        )
        .sortBy("track")
        .use();

      this.player.changePlaylist(songs, play);
    },

    selectGenre(genre, play = false) {
      let songs = this.$collect(this.songs)
        .filter((song) => song.genre === genre)
        .sortBy((song) => {
          return (
            song.artist.padEnd(40, "") +
            song.album.padEnd(20, "") +
            song.track.toString().padStart(3, "0")
          );
        })
        .use();

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
