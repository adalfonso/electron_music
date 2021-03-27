<template>
  <div class="overlay center" @click="hide">
    <section id="file-browser" @click.stop>
      <h3>Browse for files</h3>

      <input type="file" webkitdirectory @change="crawl" />

      <template v-if="crawler.is_busy">
        <p v-if="crawler.stats">
          <b>{{ crawler.stats.processed_count }}</b> out of
          <b>{{ crawler.stats.total_files_count }}</b>
        </p>
        <p v-if="crawler.current_file">
          <b>Crawling:</b>
          <br />
          {{ crawler.current_file }}
        </p>
      </template>

      <template v-if="crawler_results">
        <p>
          Processed <b>{{ crawler_results.total_files_count }}</b> in
          <b>{{
            (crawler_results.ended_at - crawler_results.started_at) / 1000
          }}</b>
          seconds
        </p>
      </template>
    </section>
  </div>
</template>

<script lang="ts">
import { Crawler, CrawlResult, CrawlStats } from "@/lib/Crawler";
import { Vue, Component } from "vue-property-decorator";
import { library_store } from "@/index";

@Component
export default class FileBrowserComponent extends Vue {
  /** Traverses local files and stores metadata in data store */
  crawler: Crawler = new Crawler(library_store);

  /** Stats from the last ran crawl */
  crawler_results: CrawlStats = null;

  /** Emit a hide event to the parent */
  hide() {
    this.$emit("hide");
  }

  /**
   * Initate crawler based on a file input
   *
   * @param event - file input event
   */
  crawl(event: Event) {
    const target = event.target as HTMLInputElement;
    this.crawler_results = null;
    this.crawler
      .crawl(Array.from(target.files))
      .then(results => (this.crawler_results = results.stats));
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
