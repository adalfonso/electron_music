<template>
  <div class="overlay center" @click="hide">
    <section id="file-browser" @click.stop>
      <div class="close-pane" @click.stop="hide"></div>
      <h3>Browse for files</h3>
      <div class="file-input">
        <div>Click to add media files</div>
        <input type="file" webkitdirectory @change="crawl" />
      </div>

      <template v-if="crawler.is_busy">
        <div class="crawl-progress-bar">
          <div
            :style="
              `width:${(crawler.stats.processed_count /
                crawler.stats.total_files_count) *
                100}%`
            "
          ></div>
        </div>
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
          Processed <b>{{ crawler_results.total_files_count }}</b> files in
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
import { Crawler, CrawlStats } from "@/lib/Crawler";
import { Vue, Component } from "vue-property-decorator";
import { media_mediator } from "@/index";

@Component
export default class FileBrowserComponent extends Vue {
  /** Traverses local files and stores metadata in data store */
  crawler: Crawler = new Crawler(media_mediator);

  /** Stats from the last crawl */
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
  position: relative;
  width: 500px;
  height: 500px;

  h3 {
    text-transform: uppercase;
    text-align: center;
  }

  .file-input {
    display: flex;
    position: relative;

    > div {
      width: 100%;
      height: 5rem;
      border: 4px dashed $med-blue;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    input {
      position: absolute;
      border: 1px solid red;
      bottom: 0;
      top: 0;
      width: 100%;
      opacity: 0;
    }
  }

  .crawl-progress-bar {
    margin-top: 1rem;
    width: 100%;
    border: 1px solid $med-blue;
    height: 0.5rem;
    border-radius: 0.125rem;

    > div {
      background-color: $med-blue;
      height: 100%;
    }
  }
}
</style>
