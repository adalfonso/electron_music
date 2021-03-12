<template>
  <div class="overlay center" @click="hide">
    <section id="file-browser" @click.stop>
      <h3>Browse for files</h3>

      <input type="file" webkitdirectory @change="select" />

      <p v-if="crawler.is_busy && crawler.current_file">
        <b>Crawling: {{ crawler.current_file }}</b>
      </p>
    </section>
  </div>
</template>

<script lang="ts">
import { Crawler } from "@/lib/Crawler";
import { Vue, Component } from "vue-property-decorator";
import { library_store } from "@/Datastore";

@Component
export default class FileBrowserComponent extends Vue {
  crawler: Crawler = new Crawler(library_store);

  hide() {
    this.$emit("hide");
  }

  select(event: Event) {
    const target = event.target as HTMLInputElement;
    this.crawler.crawl(Array.from(target.files));
  }
}
</script>

<style lang="scss">
@import "@/global";

#file-browser {
  background: $med-blue-hover;
  border: 1px solid $med-blue;
  border-radius: 0.2rem;
  color: $dark-blue;
  padding: 1rem;
  width: 500px;
  height: 500px;

  h3 {
    text-transform: uppercase;
    text-align: center;
  }
}
</style>
