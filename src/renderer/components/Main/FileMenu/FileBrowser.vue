<template>
    <div class="overlay center" @click="hide">
        <section id="file-browser" @click.stop>
            <h3>Browse for files</h3>

            <input type="file" webkitdirectory @change="select">

            <p v-if="crawler.active && crawler.processing">
                <b>Crawling: {{ crawler.processing }}</b>
            </p>
        </section>
    </div>
</template>

<script>
    import Crawler from '@/lib/Crawler.js';

    export default {
        data() {
            return {
                library: [],
                lib: this.$db.library,
                crawler: new Crawler()
            }
        },

        methods: {
            hide() {
                this.$emit('hide');
            },

            select(event) {
                this.crawler.active = true;
                this.crawler.path = event.target.files[0].path;
                this.crawler.crawl();
            }
        }
    }
</script>

<style lang="scss">
    #file-browser {
        background: $med-blue-hover;
        border: 1px solid $med-blue;
        border-radius: .2rem;
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
