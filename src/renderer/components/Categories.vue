<template>
  <section id="categories">
    <category
      v-for="(cat, type) in categories"
      :type="type"
      :key="type"
      :category="cat"
      :selector="selector"
      @select="selectCategory"
      @reset="selected[type] = null"
    >
    </category>

    <div class="category">
      <h5>Media</h5>
      <div class="items" id="category-media">
        <div
          v-for="medium in this.transformer.media()"
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
import CategoryComponent from "./Categories/Category.vue";
import { CategoryData, SelectionCategory, Selector } from "@/media/Selector";
import { MediaDocument } from "@/media/Media";
import { Player } from "@/lib/Player";
import { Settings } from "@/lib/Settings";
import { Vue, Component, Prop } from "vue-property-decorator";
import { mediaTransformations, unknown } from "@/media/Transform";
import { media_mediator } from "@/index";

export interface Category {
  list: CategoryData[];
  hasDefault: boolean;
  display: (data: CategoryData) => string;
}

@Component({ components: { category: CategoryComponent } })
export default class CategoriesComponent extends Vue {
  /** Audio player */
  @Prop() player: Player;

  /** User settings */
  @Prop() settings: Settings;

  /** Media files */
  files: MediaDocument[] = [];

  /** Selects media based on categories like artist or album */
  selector: Selector = new Selector();

  /** Facilitate media loading */
  mounted() {
    const loader = this.loadFiles.bind(this);

    media_mediator.get().then(loader);
    media_mediator.listen(loader);
  }

  /** Group files into categories and provide means to view */
  get categories(): Record<string, Category> {
    return {
      artist: {
        list: this.transformer.artists(),
        hasDefault: true,
        display: data => data.artist || unknown.artist,
      },
      album: {
        list: this.transformer.albums(
          this.selector.get("artist")?.artist ?? null
        ),
        hasDefault: true,
        display: data => data.album || unknown.album,
      },
      genre: {
        list: this.transformer.genres(),
        hasDefault: false,
        display: data => data.genre || unknown.genre,
      },
    };
  }

  /** Used ot transform media files into selection category data */
  get transformer() {
    return mediaTransformations(this.files);
  }

  /**
   * Load media files into the component
   *
   * @param files - files to load
   */
  loadFiles(files: MediaDocument[]) {
    this.files = files;
  }

  /**
   * Select a new category
   *
   * @param category - category type, e.g. artist, album, genre
   * @param data     - basic data about category selection
   * @param play     - if playback should start immediately
   */
  selectCategory(
    category: SelectionCategory,
    data: CategoryData,
    play: boolean
  ) {
    const files = this.selector.select(
      category,
      data,
      this.files,
      this.settings
    );

    this.player.changePlaylist(files, play);
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
