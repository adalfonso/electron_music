<template>
  <div class="category">
    <h5>{{ title }}</h5>
    <div class="items" :id="'category-' + type">
      <div v-if="cat.hasDefault" class="item" @click="reset">
        [All {{ cat.title }} - {{ cat.list.length }}]
      </div>
      <div
        v-for="item in cat.list"
        :class="isSelected(item) ? 'item selected' : 'item'"
        :id="type + '-' + cat.display(item).replace(/\s/g, '_')"
        @click="select(item)"
        @dblclick="select(item, true)"
      >
        {{ cat.display(item) }}
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  props: {
    type: { required: true },
    cat: { required: true },
    selector: { required: true }
  },

  data() {
    return {
      goToTracker: {
        at: moment(),
        input: ""
      }
    };
  },

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
          return this.enterKeySelect();
        default:
          this.goToSearch(event);
      }
    });
  },

  computed: {
    /** If the current category is being clicked/traversed */
    active() {
      return this.selector.last.category === this.type;
    },

    title() {
      return this.type.charAt(0).toUpperCase() + this.type.slice(1) + "s";
    }
  },

  methods: {
    enterKeySelect() {
      this.select(this.selector.get(this.type), true);
    },

    select(item, play) {
      this.$emit("select", this.type, item, play);
    },

    /**
     * If a given item in the category is selected
     */
    isSelected(item) {
      return (
        (this.selector.get(this.type) || {})[this.type] === item[this.type]
      );
    },

    goToSearch(event) {
      let now = moment();
      this.goToTracker.at.add(1000, "milliseconds");

      let newSearch = this.goToTracker.at.isBefore(now);

      this.goToTracker.input = newSearch
        ? event.key
        : this.goToTracker.input + event.key;

      this.goToTracker.at = now;
      this.goTo();
    },

    goTo() {
      const regex = new RegExp("^" + this.goToTracker.input, "i");

      const items = this.cat.list.filter(item => regex.test(item[this.type]));

      if (!items.length) {
        return;
      }

      const item = items[0];

      this.setHash(item);
      this.select(item);
    },

    reset() {
      this.$emit("reset");
    },

    setHash(item) {
      location.hash = `#${this.type}-${this.cat
        .display(item)
        .replace(/\s/g, "_")}`;
    },

    traverseCategory(direction) {
      let item = this.selector.get(this.type);

      let index = this.cat.list
        .map((_item, i) => (_item[this.type] === item[this.type] ? i : null))
        .filter(item => item !== null)[0];

      let list = this.cat.list;

      if (direction === "previous" && index > 0) {
        item = list[index - 1];
      } else if (direction === "next" && index < list.length - 1) {
        item = list[index + 1];
      }

      this.selector.set(this.type, item);

      this.setHash(item);
    }
  }
};
</script>

<style lang="scss"></style>
