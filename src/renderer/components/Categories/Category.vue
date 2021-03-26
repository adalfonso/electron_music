<template>
  <div class="category">
    <h5>{{ title }}</h5>
    <div class="items" :id="`category-${type}`">
      <div v-if="category.hasDefault" class="item" @click="reset">
        [All {{ category.title }} - {{ category.list.length }}]
      </div>
      <div
        v-for="item in category.list"
        :class="isSelected(item) ? 'item selected' : 'item'"
        :id="type + '-' + category.display(item).replace(/\s/g, '_')"
        @click="select(item)"
        @dblclick="select(item, true)"
        :key="item[type] + item.year"
      >
        {{ category.display(item) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import { Category } from "../Categories.vue";
import { CategoryData, SelectionCategory, Selector } from "@/media/Selector";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class CategoryComponent extends Vue {
  /** Category type */
  @Prop() type: SelectionCategory;

  /** Category tools */
  @Prop() category: Category;

  /** Category selector */
  @Prop() selector: Selector;

  /** Number of milleseconds to wait before resetting the search input */
  textSearchDelay = 1000;

  /** Tracks text searches in the category */
  textSearch = {
    lastInput: moment(),
    input: "",
  };

  created() {
    window.addEventListener("keyup", event => {
      if (!this.active) {
        return;
      }

      switch (event.key) {
        case "ArrowUp":
          return this.traverseCategory("previous");
        case "ArrowDown":
          return this.traverseCategory("next");
        case "Enter":
          return this.onEnterKey();
        default:
          this.onSearch(event);
      }
    });
  }

  /** If the current category is being clicked/traversed */
  get active() {
    return this.selector.last.category === this.type;
  }

  /** Display the category type as a title */
  get title() {
    return this.type.charAt(0).toUpperCase() + this.type.slice(1) + "s";
  }

  /** Select the category item when the enter key is presses */
  onEnterKey() {
    this.select(this.selector.get(this.type), true);
  }

  /**
   * Emit a select event to the parent
   *
   * @param data - category data
   * @param play - if the track should play immediately
   */
  select(data: CategoryData, play: boolean = false) {
    this.$emit("select", this.type, data, play);
  }

  /**
   * If a given item in the category is selected
   *
   * @param data - category data
   *
   * @return if the the data is selected or not
   */
  isSelected(data: CategoryData): boolean {
    return (this.selector.get(this.type) || {})[this.type] === data[this.type];
  }

  /**
   * Handle a keyboard input for text search in the category
   *
   * @param event - keyboard input event
   */
  onSearch(event: KeyboardEvent) {
    const now = moment();

    const searchWasReset =
      now.diff(this.textSearch.lastInput, "milliseconds") >
      this.textSearchDelay;

    this.textSearch.input = searchWasReset
      ? event.key
      : this.textSearch.input + event.key;

    this.textSearch.lastInput = now;
    this.search();
  }

  /** Apply the search and traverse the UI if there is a hit */
  search() {
    const regex = new RegExp("^" + this.textSearch.input, "i");

    const items = this.category.list.filter(item =>
      regex.test(item[this.type])
    );

    if (!items.length) {
      return;
    }

    const item = items[0];

    this.setHash(item);
    this.select(item);
  }

  /**
   * Emit the reset event to the parent
   *
   * This takes place then the user clicks the default selection, e.g. [All - 9]   *
   */
  reset() {
    this.$emit("reset");
  }

  /**
   * Set the location hash for the category when it gets selected
   *
   * @param data - category data
   */
  setHash(data: CategoryData) {
    location.hash = `#${this.type}-${this.category
      .display(data)
      .replace(/\s/g, "_")}`;
  }

  /**
   * Move up or down in the categoy
   *
   * This is triggered by the up/down arrows on the keyboard
   *
   * @param direction - previous or next
   */
  traverseCategory(direction: "previous" | "next") {
    const data = this.selector.get(this.type);
    const type = this.type;

    let current_selection = data;

    const index = this.category.list
      .map((item, index) => (item[type] === data[type] ? index : null))
      .filter(item => item !== null)[0];

    const list = this.category.list;

    if (direction === "previous" && index > 0) {
      current_selection = list[index - 1];
    } else if (direction === "next" && index < list.length - 1) {
      current_selection = list[index + 1];
    }

    this.select(current_selection);

    this.setHash(current_selection);
  }
}
</script>

<style lang="scss"></style>
